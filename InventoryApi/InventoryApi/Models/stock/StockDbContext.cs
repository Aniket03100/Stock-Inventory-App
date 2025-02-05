using Microsoft.EntityFrameworkCore;

namespace InventoryApi.Models.stock
{
    public class StockDbContext : DbContext
    {
        public StockDbContext(DbContextOptions<StockDbContext> options) : base(options) { }

        public DbSet<StockProduct> StockProducts { get; set; }
        public DbSet<StockPurchase> StockPurchases { get; set; }
        public DbSet<StockSale> StockSales { get; set; }
        public DbSet<StockStock> StockStocks {  get; set; }

        public DbSet<Registration> Registration { get; set; } 
        public DbSet<Login> Login { get; set; }

    }
}
