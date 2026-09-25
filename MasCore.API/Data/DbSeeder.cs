using MasCore.API.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace MasCore.API.Data;

public static class DbSeeder
{
    public static async Task SeedAsync(IServiceProvider services)
    {
        using var scope = services.CreateScope();

        var serviceProvider = scope.ServiceProvider;

        var configuration =
            serviceProvider.GetRequiredService<IConfiguration>();

        var context =
            serviceProvider.GetRequiredService<AppDbContext>();

        var roleManager =
            serviceProvider.GetRequiredService<RoleManager<IdentityRole>>();

        var userManager =
            serviceProvider.GetRequiredService<UserManager<AppUser>>();

        // Apply pending migrations
        await context.Database.MigrateAsync();

        // ------------------------------------------------------------
        // Admin role
        // ------------------------------------------------------------

        const string adminRole = "Admin";

        if (!await roleManager.RoleExistsAsync(adminRole))
        {
            var role = new IdentityRole(adminRole);

            var roleResult =
                await roleManager.CreateAsync(role);

            if (!roleResult.Succeeded)
            {
                throw new InvalidOperationException(
                    "Failed to create Admin role.");
            }
        }

        // ------------------------------------------------------------
        // Admin account settings
        // ------------------------------------------------------------

        var adminEmail =
            configuration["Admin:Email"];

        var adminPassword =
            configuration["Admin:Password"];

        if (string.IsNullOrWhiteSpace(adminEmail))
        {
            throw new InvalidOperationException(
                "Admin email is not configured.");
        }

        if (string.IsNullOrWhiteSpace(adminPassword))
        {
            throw new InvalidOperationException(
                "Admin password is not configured.");
        }

        // ------------------------------------------------------------
        // Admin user
        // ------------------------------------------------------------

        var adminUser =
            await userManager.FindByEmailAsync(adminEmail);

        if (adminUser is null)
        {
            adminUser = new AppUser
            {
                UserName = adminEmail,
                Email = adminEmail,
                EmailConfirmed = true
            };

            var userResult =
                await userManager.CreateAsync(
                    adminUser,
                    adminPassword);

            if (!userResult.Succeeded)
            {
                var errors = string.Join(
                    ", ",
                    userResult.Errors.Select(x => x.Description));

                throw new InvalidOperationException(
                    $"Failed to create admin user: {errors}");
            }
        }

        // ------------------------------------------------------------
        // Ensure Admin role
        // ------------------------------------------------------------

        if (!await userManager.IsInRoleAsync(adminUser, adminRole))
        {
            var roleResult =
                await userManager.AddToRoleAsync(
                    adminUser,
                    adminRole);

            if (!roleResult.Succeeded)
            {
                throw new InvalidOperationException(
                    "Failed to assign Admin role.");
            }
        }
    }
}