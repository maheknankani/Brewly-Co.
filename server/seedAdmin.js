require('dotenv').config();
const { connectDB, Admin } = require('./db');
const { hashPasswordSync } = require('./authUtils');

async function seedAdminUser() {
  try {
    await connectDB();

    const adminEmail = (process.env.ADMIN_EMAIL || 'admin@brewly.com').toLowerCase();
    const adminUsername = (process.env.ADMIN_USER || 'admin').toLowerCase();
    const adminPassword = process.env.ADMIN_PASS;

    if (!adminPassword) {
      console.error('❌ Error: ADMIN_PASS is not defined in your environment (.env).');
      console.error('Please configure ADMIN_PASS in server/.env before seeding the admin account.');
      process.exit(1);
    }

    const hashedPassword = hashPasswordSync(adminPassword);

    const existingAdmin = await Admin.findOne({
      $or: [{ email: adminEmail }, { username: adminUsername }]
    });

    if (existingAdmin) {
      existingAdmin.email = adminEmail;
      existingAdmin.username = adminUsername;
      existingAdmin.passwordHash = hashedPassword;
      existingAdmin.role = 'admin';
      existingAdmin.name = 'Head Roaster Admin';
      await existingAdmin.save();
      console.log(`✅ Admin account updated in MongoDB: ${adminEmail} (Role: admin)`);
    } else {
      const newAdmin = new Admin({
        id: 'admin-master-01',
        username: adminUsername,
        email: adminEmail,
        passwordHash: hashedPassword,
        name: 'Head Roaster Admin',
        role: 'admin'
      });
      await newAdmin.save();
      console.log(`✅ Admin account seeded into MongoDB: ${adminEmail} (Role: admin)`);
    }

    process.exit(0);
  } catch (err) {
    console.error('❌ Error seeding admin user:', err.message);
    process.exit(1);
  }
}

seedAdminUser();
