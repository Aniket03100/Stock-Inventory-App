using InventoryApi.Models.stock;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ApiExplorer;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;


namespace InventoryApi.Controllers
{
    [Route("api/StockInventory")]
    [ApiController]
    [EnableCors("AllowSpecificOrigin")]
    public class StockInventoryController : ControllerBase
    {
        private readonly StockDbContext _context;
        private readonly IConfiguration _configuration;

        public StockInventoryController(StockDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }






        #region Login API


        [HttpPost("RegisterUser")]
        public ApiResponse RegisterUser([FromBody] Registration model)
        {
            ApiResponse _res = new ApiResponse();

            try
            {
                using (SqlConnection conn = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
                {
                    conn.Open();

                    // Check if the username or email already exists
                    string checkQuery = @"SELECT COUNT(1) FROM Registration WHERE Username = @Username OR Email = @Email";
                    SqlCommand checkCmd = new SqlCommand(checkQuery, conn);
                    checkCmd.Parameters.AddWithValue("@Username", model.Username);
                    checkCmd.Parameters.AddWithValue("@Email", model.Email);
                    int exists = Convert.ToInt32(checkCmd.ExecuteScalar());

                    if (exists > 0)
                    {
                        _res.Result = false;
                        _res.Message = "Username or Email already exists.";
                        return _res;
                    }

                    // Insert the new user
                    string query = @"INSERT INTO Registration (FullName, Email, MobileNo, Address, Username, Password, CreatedDate)
                             VALUES (@FullName, @Email, @MobileNo, @Address, @Username, @Password, @CreatedDate)";

                    SqlCommand cmd = new SqlCommand(query, conn);
                    cmd.Parameters.AddWithValue("@FullName", model.FullName);
                    cmd.Parameters.AddWithValue("@Email", model.Email);
                    cmd.Parameters.AddWithValue("@MobileNo", model.MobileNo ?? string.Empty);
                    cmd.Parameters.AddWithValue("@Address", model.Address ?? string.Empty);
                    cmd.Parameters.AddWithValue("@Username", model.Username);
                    cmd.Parameters.AddWithValue("@Password", model.Password);
                    cmd.Parameters.AddWithValue("@CreatedDate", model.CreatedDate);

                    int rows = cmd.ExecuteNonQuery();

                    if (rows > 0)
                    {
                        _res.Result = true;
                        _res.Message = "User registered successfully.";
                    }
                    else
                    {
                        _res.Result = false;
                        _res.Message = "Failed to register user.";
                    }
                }
            }
            catch (Exception ex)
            {
                _res.Result = false;
                _res.Message = ex.Message;
            }

            return _res;
        }





        [HttpPost("LoginUser")]
        public ApiResponse LoginUser([FromBody] Login model)
        {
            ApiResponse _res = new ApiResponse();

            try
            {
                using (SqlConnection conn = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
                {
                    conn.Open();

                    // Check credentials in the Registration table
                    string query = @"SELECT UserId, FullName, Email FROM Registration 
                             WHERE Username = @Username AND Password = @Password";

                    SqlCommand cmd = new SqlCommand(query, conn);
                    cmd.Parameters.AddWithValue("@Username", model.Username);
                    cmd.Parameters.AddWithValue("@Password", model.Password);

                    SqlDataReader reader = cmd.ExecuteReader();

                    if (reader.HasRows)
                    {
                        var user = new Dictionary<string, object>();
                        while (reader.Read())
                        {
                            user["UserId"] = reader["UserId"];
                            user["FullName"] = reader["FullName"];
                            user["Email"] = reader["Email"];
                        }

                        // Add login entry into the Login table
                        reader.Close();
                        string loginQuery = @"INSERT INTO Login (Username, Password)
                                      VALUES (@Username, @Password)";
                        SqlCommand loginCmd = new SqlCommand(loginQuery, conn);
                        loginCmd.Parameters.AddWithValue("@Username", model.Username);
                        loginCmd.Parameters.AddWithValue("@Password", model.Password);
                        

                        loginCmd.ExecuteNonQuery();

                        _res.Result = true;
                        _res.Data = user;
                        _res.Message = "Login successful.";
                    }
                    else
                    {
                        _res.Result = false;
                        _res.Message = "Invalid Username or Password.";
                    }
                }
            }
            catch (Exception ex)
            {
                _res.Result = false;
                _res.Message = $"An error occurred: {ex.Message}";
            }

            return _res;
        }



        #endregion








        #region Purchase API

        [HttpGet("GetAllPurchase")]

        public ApiResponse GetAllPurchase() {

            ApiResponse _res = new ApiResponse();
            try
            {
                // NOT USING THIS --->    var all = _context.StockPurchases.ToList();  --> database.table.tolist     --getting data from that tbl
                //LINQ

                var all = (from purchase in _context.StockPurchases
                           join product in _context.StockProducts on purchase.productId equals product.productId
                           select new
                           {
                               invoiceAmount = purchase.invoiceAmount,
                               invoiceNo = purchase.invoiceNo,
                               productId = purchase.productId,
                               purchaseDate = purchase.purchaseDate,
                               purchaseId = purchase.purchaseId,
                               quantity = purchase.quantity,
                               supplierName = purchase.supplierName,
                               productName = product.productName,


                           }).OrderByDescending(m => m.purchaseId).ToList();

                
                _res.Result = true;
                _res.Data = all;          
                return _res;
            }
            catch (Exception ex) {
            
                _res.Result = false;
                _res.Message = ex.Message;
                return _res;
            
            }

        }



        [HttpPost("CreateNewPurchase")]

        public ApiResponse CreateNewPurchase([FromBody] StockPurchase obj)
        {
            ApiResponse _res = new ApiResponse();
            if(!ModelState.IsValid)
            {
                _res.Result = false;
                _res.Message = "Validation Error";
                return _res;
            }

            try
            {
                var isExist = _context.StockPurchases.SingleOrDefault(m => m.invoiceNo.ToLower() == obj.invoiceNo.ToLower());
                if(isExist == null)
                {
                    _context.StockPurchases.Add(obj);
                    _context.SaveChanges();

                    var isStockExist = _context.StockStocks.SingleOrDefault(m => m.productId == obj.productId);
                    if(isStockExist == null)
                    {
                        StockStock _stock = new StockStock()
                        {
                            createdDate = DateTime.Now,
                            lastModifiedDate = DateTime.Now,
                            productId = obj.productId,
                            quantity = obj.quantity
                        };
                        _context.StockStocks.Add( _stock );
                        _context.SaveChanges();
                    }
                    else
                    {
                        isStockExist.quantity = isStockExist.quantity + obj.quantity;
                        isStockExist.lastModifiedDate = DateTime.Now;
                        _context.SaveChanges();
                    }



                    _res.Result = true;
                    _res.Message = "Purchase Entry Created Successfully";
                    return _res;
                }
                else
                {
                    _res.Result = false;
                    _res.Message = "Invoice No Already Present";
                    return _res;
                }
            }

            catch(Exception ex)
            {
                _res.Result = false;
                _res.Message = ex.Message;
                return _res;
            }
        }



        #endregion



        #region Sale API

        [HttpGet("GetAllSale")]

        public ApiResponse GetAllSale()
        {

            ApiResponse _res = new ApiResponse();
            try
            {
                // NOT USING THIS --->    var all = _context.StockPurchases.ToList();  --> database.table.tolist     --getting data from that tbl
                //LINQ

                var all = (from sale in _context.StockSales
                           join product in _context.StockProducts on sale.productId equals product.productId
                           select new
                           {
                               customerName = sale.customerName,
                               mobileNo = sale.mobileNo,
                               invoiceNo = sale.invoiceNo,
                               productId = sale.productId,
                               quantity = sale.quantity,
                               saleDate = sale.saleDate,
                               saleId = sale.saleId,
                               totalAmount = sale.totalAmount,
                               productName = product.productName,


                           }).OrderByDescending(m => m.saleId).ToList();


                _res.Result = true;
                _res.Data = all;         
                return _res;
            }
            catch (Exception ex)
            {

                _res.Result = false;
                _res.Message = ex.Message;
                return _res;

            }

        }



        [HttpPost("CreateNewSale")]

        public ApiResponse CreateNewSale([FromBody] StockSale obj)
        {
            ApiResponse _res = new ApiResponse();
            if (!ModelState.IsValid)
            {
                _res.Result = false;
                _res.Message = "Validation Error";
                return _res;
            }

            try
            {
                var isExist = _context.StockSales.SingleOrDefault(m => m.invoiceNo.ToLower() == obj.invoiceNo.ToLower());
                var isStockExist = _context.StockStocks.SingleOrDefault(m => m.productId == obj.productId);
                if (isExist == null && isStockExist != null)
                {
                    _context.StockSales.Add(obj);
                    _context.SaveChanges();

                    isStockExist.quantity = isStockExist.quantity - obj.quantity;
                    isStockExist.lastModifiedDate = DateTime.Now;
                    _context.SaveChanges();

                    _res.Result = true;
                    _res.Message = "Sale Entry Created Successfully";
                    return _res;
                }
                else
                {
                    _res.Result = false;
                    _res.Message = "Invoice No Already Present";
                    return _res;
                }
            }

            catch (Exception ex)
            {
                _res.Result = false;
                _res.Message = ex.Message;
                return _res;
            }
        }



        #endregion




        #region Products API

        [HttpGet("GetAllProducts")]

        public ApiResponse GetAllProducts()
        {

            ApiResponse _res = new ApiResponse();
            try
            {
                

                var all = _context.StockProducts.ToList();
                _res.Result = true;
                _res.Data = all;         // GETTING ERROR HERE
                return _res;
            }
            catch (Exception ex)
            {

                _res.Result = false;
                _res.Message = ex.Message;
                return _res;

            }

        }



        [HttpPost("CreateNewProduct")]

        public ApiResponse CreateNewProduct([FromBody] StockProduct obj)
        {
            ApiResponse _res = new ApiResponse();
            if (!ModelState.IsValid)
            {
                _res.Result = false;
                _res.Message = "Validation Error";
                return _res;
            }

            try
            {
                var isExist = _context.StockProducts.SingleOrDefault(m => m.productName.ToLower() == obj.productName.ToLower());
               
                if (isExist == null)
                {
                    _context.StockProducts.Add(obj);
                    _context.SaveChanges();

                   

                    _res.Result = true;
                    _res.Message = "Product Entry Created Successfully";
                    return _res;
                }
                else
                {
                    _res.Result = false;
                    _res.Message = "Product Name Already Present";
                    return _res;
                }
            }

            catch (Exception ex)
            {
                _res.Result = false;
                _res.Message = ex.Message;
                return _res;
            }
        }



        #endregion




        #region Stock API

        [HttpGet("GetAllStock")]

        public ApiResponse GetAllStock()
        {

            ApiResponse _res = new ApiResponse();
            try
            {
                

                var all = (from stock in _context.StockStocks
                           join product in _context.StockProducts on stock.productId equals product.productId
                           select new
                           {
                               createdDate = stock.createdDate,
                               lastModifiedDate = stock.lastModifiedDate,
                               productId = stock.productId,
                               quantity = stock.quantity,
                               stockId = stock.stockId,
                              
                               productName = product.productName,


                           }).OrderByDescending(m => m.stockId).ToList();


                _res.Result = true;
                _res.Data = all;         
                return _res;
            }
            catch (Exception ex)
            {

                _res.Result = false;
                _res.Message = ex.Message;
                return _res;

            }

        }



        [HttpGet("checkStockByProductId")]

        public ApiResponse checkStockByProductId(int productId)
        {

            ApiResponse _res = new ApiResponse();
            try
            {


                var stock = _context.StockStocks.SingleOrDefault(m => m.productId == productId);

                if(stock != null)
                {
                    if(stock.quantity != 0)
                    {
                        _res.Result = true;
                        _res.Data = stock;
                        _res.Message = "Stock Available";
                    }
                    else
                    {
                        _res.Result = false;
                        _res.Message = "No Stock Available";
                    }
                }
                else
                {
                    _res.Result = false;
                    _res.Message = "No Stock Available";
                }


               
                return _res;
            }
            catch (Exception ex)
            {

                _res.Result = false;
                _res.Message = ex.Message;
                return _res;

            }

        }





        #endregion




    }
}
