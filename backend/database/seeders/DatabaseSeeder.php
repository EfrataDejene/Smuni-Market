<?php

namespace Database\Seeders;

use App\Models\Brand;
use App\Models\Category;
use App\Models\Cart;
use App\Models\Inventory;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database with initial SMUNI-Market data.
     * This provides:
     *  - 1 admin
     *  - 2 sellers (active, approved)
     *  - 2 customers
     *  - 2 delivery_personnel Personnel
     *  - 5 Categories
     *  - 5 Brands
     *  - 6 Sample Products (3 per seller) with inventory records
     */
    public function run(): void
    {
        // ── Users ──────────────────────────────────────────────────────────────

        $admin = User::create([
            'name'     => 'admin User',
            'email'    => 'admin@smunimarket.com',
            'password' => Hash::make('password'),
            'phone'    => '+251911000001',
            'role'     => 'admin',
            'status'   => 'active',
            'address'  => 'Addis Ababa, Ethiopia',
        ]);

        $seller1 = User::create([
            'name'     => 'Abebe Kebede',
            'email'    => 'seller1@smunimarket.com',
            'password' => Hash::make('password'),
            'phone'    => '+251911000002',
            'role'     => 'seller',
            'status'   => 'active',
            'address'  => 'Addis Ababa, Bole',
        ]);

        $seller2 = User::create([
            'name'     => 'Tigist Haile',
            'email'    => 'seller2@smunimarket.com',
            'password' => Hash::make('password'),
            'phone'    => '+251911000003',
            'role'     => 'seller',
            'status'   => 'active',
            'address'  => 'Addis Ababa, Piassa',
        ]);

        $sellerHabesha = User::create([
            'name'     => 'Habesha Store',
            'email'    => 'habesha@seller.com',
            'password' => Hash::make('password123'),
            'phone'    => '+251911000003',
            'role'     => 'seller',
            'status'   => 'active',
            'address'  => 'Addis Ababa, Piassa',
        ]);

        $customer1 = User::create([
            'name'     => 'Dawit Mengistu',
            'email'    => 'customer1@smunimarket.com',
            'password' => Hash::make('password'),
            'phone'    => '+251911000004',
            'role'     => 'customer',
            'status'   => 'active',
            'address'  => 'Addis Ababa, Kazanchis',
        ]);

        $customer2 = User::create([
            'name'     => 'Meron Tadesse',
            'email'    => 'customer2@smunimarket.com',
            'password' => Hash::make('password'),
            'phone'    => '+251911000005',
            'role'     => 'customer',
            'status'   => 'active',
            'address'  => 'Addis Ababa, Mexico',
        ]);

        User::create([
            'name'     => 'Yonas Tesfaye',
            'email'    => 'delivery1@smunimarket.com',
            'password' => Hash::make('password'),
            'phone'    => '+251911000006',
            'role'     => 'delivery_personnel',
            'status'   => 'active',
            'address'  => 'Addis Ababa, Sarbet',
        ]);

        User::create([
            'name'     => 'Hana Solomon',
            'email'    => 'delivery2@smunimarket.com',
            'password' => Hash::make('password'),
            'phone'    => '+251911000007',
            'role'     => 'delivery_personnel',
            'status'   => 'active',
            'address'  => 'Addis Ababa, Lebu',
        ]);

        // ── Categories ─────────────────────────────────────────────────────────

        $electronics = Category::create(['name' => 'Electronics', 'description' => 'Electronic devices and accessories']);
        $clothing    = Category::create(['name' => 'Clothing',    'description' => 'Men and women fashion']);
        $groceries   = Category::create(['name' => 'Groceries',   'description' => 'Food and daily essentials']);
        $homeGoods   = Category::create(['name' => 'Home & Garden','description' => 'Home appliances and garden supplies']);
        $beauty      = Category::create(['name' => 'Beauty',      'description' => 'Cosmetics and personal care']);

        // ── Brands ─────────────────────────────────────────────────────────────

        $samsung  = Brand::create(['name' => 'Samsung',    'description' => 'Korean electronics brand']);
        $adidas   = Brand::create(['name' => 'Adidas',     'description' => 'Global sportswear brand']);
        $generic  = Brand::create(['name' => 'Local Brand','description' => 'Locally manufactured products']);
        $nokia    = Brand::create(['name' => 'Nokia',      'description' => 'Finnish telecommunications brand']);
        $loreal   = Brand::create(['name' => "L'Oreal",   'description' => 'French cosmetics brand']);

        // ── Products + Inventory (seller 1) ────────────────────────────────────

        $p1 = Product::create([
            'seller_id'    => $seller1->id,
            'category_id'  => $electronics->id,
            'brand_id'     => $samsung->id,
            'name' => 'Samsung Galaxy A15',
            'description'  => '6.5 inch display, 4GB RAM, 128GB storage smartphone.',
            'price'        => 14500.00,
            'discount'     => 5.00,
            'status'       => 'active',
        ]);
        Inventory::create([
            'product_id'        => $p1->id,
            'quantity'          => 50,
            'low_stock_threshold' => 10,
            'stock_status'      => 'Available',
        ]);

        $p2 = Product::create([
            'seller_id'    => $seller1->id,
            'category_id'  => $electronics->id,
            'brand_id'     => $nokia->id,
            'name' => 'Nokia 105',
            'description'  => 'Dual SIM basic phone with long battery life.',
            'price'        => 1200.00,
            'discount'     => 0.00,
            'status'       => 'active',
        ]);
        Inventory::create([
            'product_id'        => $p2->id,
            'quantity'          => 4,
            'low_stock_threshold' => 5,
            'stock_status'      => 'Low',
        ]);

        $p3 = Product::create([
            'seller_id'    => $seller1->id,
            'category_id'  => $homeGoods->id,
            'brand_id'     => null,
            'name' => 'Pressure Cooker 6L',
            'description'  => 'Stainless steel pressure cooker, 6 litre capacity.',
            'price'        => 3200.00,
            'discount'     => 10.00,
            'status'       => 'active',
        ]);
        Inventory::create([
            'product_id'        => $p3->id,
            'quantity'          => 20,
            'low_stock_threshold' => 5,
            'stock_status'      => 'Available',
        ]);

        // ── Products + Inventory (seller 2) ────────────────────────────────────

        $p4 = Product::create([
            'seller_id'    => $seller2->id,
            'category_id'  => $clothing->id,
            'brand_id'     => $adidas->id,
            'name' => 'Adidas Running Shoes',
            'description'  => 'Lightweight running shoes for men, size 40–45.',
            'price'        => 5800.00,
            'discount'     => 0.00,
            'status'       => 'active',
        ]);
        Inventory::create([
            'product_id'        => $p4->id,
            'quantity'          => 30,
            'low_stock_threshold' => 5,
            'stock_status'      => 'Available',
        ]);

        $p5 = Product::create([
            'seller_id'    => $seller2->id,
            'category_id'  => $beauty->id,
            'brand_id'     => $loreal->id,
            'name' => "L'Oreal Elvive Shampoo",
            'description'  => '400ml moisturising shampoo for all hair types.',
            'price'        => 320.00,
            'discount'     => 0.00,
            'status'       => 'active',
        ]);
        Inventory::create([
            'product_id'        => $p5->id,
            'quantity'          => 0,
            'low_stock_threshold' => 10,
            'stock_status'      => 'Out',
        ]);

        $p6 = Product::create([
            'seller_id'    => $seller2->id,
            'category_id'  => $groceries->id,
            'brand_id'     => $generic->id,
            'name' => 'Organic Teff Flour 2kg',
            'description'  => 'Pure Ethiopian organic teff flour, 2kg package.',
            'price'        => 180.00,
            'discount'     => 0.00,
            'status'       => 'active',
        ]);
        Inventory::create([
            'product_id'        => $p6->id,
            'quantity'          => 100,
            'low_stock_threshold' => 20,
            'stock_status'      => 'Available',
        ]);

        // ── customer Carts ──────────────────────────────────────────────────────

        Cart::create(['user_id' => $customer1->id]);
        Cart::create(['user_id' => $customer2->id]);

        $this->command->info('✅ SMUNI-Market database seeded successfully!');
        $this->command->info('   admin:    admin@smunimarket.com / password');
        $this->command->info('   seller1:  seller1@smunimarket.com / password');
        $this->command->info('   seller2:  seller2@smunimarket.com / password');
        $this->command->info('   customer: customer1@smunimarket.com / password');
        $this->command->info('   delivery_personnel: delivery1@smunimarket.com / password');
    }
}
