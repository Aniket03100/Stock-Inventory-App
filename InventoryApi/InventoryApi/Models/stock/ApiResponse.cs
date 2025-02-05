
namespace InventoryApi.Controllers
{
    public class ApiResponse
    {
        public bool Result { get;  set; }
        public string Message { get;  set; }
        public object Data { get; set; }
    }
}