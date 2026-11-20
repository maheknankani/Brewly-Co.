const mongoose = require('mongoose');
const Product = require('./models/Product');
const Order = require('./models/Order');
const Subscription = require('./models/Subscription');
const Discount = require('./models/Discount');
const Review = require('./models/Review');
const ChatMessage = require('./models/ChatMessage');
const Admin = require('./models/Admin');
const Notification = require('./models/Notification');
const FreeDeliverySub = require('./models/FreeDeliverySub');
const { hashPassword } = require('./authUtils');
const {
  initialProducts,
  initialOrders,
  initialSubscriptions,
  initialDiscounts,
  initialReviews,
  initialChatMessages
} = require('./data/mockData');

const connectDB = async () => {
  const primaryUri = process.env.MONGODB_URI;
  const localUri = 'mongodb://127.0.0.1:27017/brewly';

  if (primaryUri) {
    try {
      await mongoose.connect(primaryUri, { serverSelectionTimeoutMS: 10000 });
      console.log(`🍃 Connected to Primary MongoDB (${mongoose.connection.host})`);
      await seedInitialData();
      return;
    } catch (err) {
      console.warn(`⚠️ Primary MongoDB Connection Failed: ${err.message}`);
      console.warn(`🔄 Automatically switching to Local MongoDB fallback...`);
    }
  }

  try {
    await mongoose.connect(localUri, { serverSelectionTimeoutMS: 5000 });
    console.log(`🍃 Connected to Local MongoDB Database (127.0.0.1:27017/brewly)`);
    await seedInitialData();
  } catch (err) {
    console.error('❌ Failed to connect to both Primary and Local MongoDB:', err.message);
    console.error('👉 Please check your MongoDB connection string in server/.env or start your local MongoDB service.');
  }
};

const seedInitialData = async () => {
  try {
    // Seed products only when database is empty
const productCount = await Product.countDocuments();

if (productCount === 0) {
  await Product.insertMany(initialProducts);
  console.log('🌱 Initial coffee products added successfully');
} else {
  console.log('✅ Existing products preserved');
}

    const orderCount = await Order.countDocuments();
    if (orderCount === 0) {
      await Order.insertMany(initialOrders);
    }

    const subCount = await Subscription.countDocuments();
    if (subCount === 0) {
      await Subscription.insertMany(initialSubscriptions);
    }

    const discCount = await Discount.countDocuments();
    if (discCount === 0) {
      await Discount.insertMany(initialDiscounts);
    }

    const revCount = await Review.countDocuments();
    if (revCount === 0) {
      await Review.insertMany(initialReviews);
    }

    const chatCount = await ChatMessage.countDocuments();
    if (chatCount === 0) {
      await ChatMessage.insertMany(initialChatMessages);
    }

    // Seed default master admin from environment configuration if no admin exists
    const adminCount = await Admin.countDocuments();
    if (adminCount === 0) {
      const defaultUsername = (process.env.ADMIN_USER || 'admin').toLowerCase();
      const defaultEmail = (process.env.ADMIN_EMAIL || 'admin@brewly.com').toLowerCase();
      const defaultPassword = process.env.ADMIN_PASS;

      if (defaultPassword) {
        const hashedPassword = await hashPassword(defaultPassword);
        const defaultAdmin = new Admin({
          id: 'admin-master-01',
          username: defaultUsername,
          email: defaultEmail,
          passwordHash: hashedPassword,
          name: 'Head Roaster Admin',
          role: 'admin'
        });
        await defaultAdmin.save();
        console.log(`🔒 Master Admin user initialized in database for: ${defaultEmail} (bcrypt hashed)`);
      } else {
        console.warn('⚠️ No ADMIN_PASS configured in environment. Admin seeding skipped.');
      }
    } else {
      // If admin already exists but passwordHash was corrupted or unhashed, allow environment sync
      const adminDoc = await Admin.findOne({ username: (process.env.ADMIN_USER || 'admin').toLowerCase() });
      if (adminDoc && process.env.ADMIN_PASS && (!adminDoc.passwordHash || !adminDoc.passwordHash.startsWith('$2'))) {
        adminDoc.passwordHash = await hashPassword(process.env.ADMIN_PASS);
        await adminDoc.save();
        console.log('🔒 Existing admin password hash verified and updated with bcrypt.');
      }
    }

    // Seed initial Free Delivery Subscriptions
    const fdSubCount = await FreeDeliverySub.countDocuments();
    if (fdSubCount === 0) {
      const now = new Date();
      const oneMonthLater = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
      const twoMonthsLater = new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000);
      const pastStart = new Date(now.getTime() - 95 * 24 * 60 * 60 * 1000);
      const pastExpiry = new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000);

      await FreeDeliverySub.insertMany([
        {
          id: 'FD-SUB-101',
          userId: 'user-ali-khan',
          userName: 'Ali Khan',
          email: 'ali.khan@example.com',
          phone: '+92 300 9876543',
          selectedPlan: '1 Month',
          duration: '1 Month',
          amountPaid: 100,
          paymentStatus: 'Paid',
          paymentMethod: 'JazzCash / EasyPaisa',
          transactionId: 'TXN-FD-9841',
          paymentDate: now,
          startDate: now,
          expiryDate: oneMonthLater,
          status: 'Active'
        },
        {
          id: 'FD-SUB-102',
          userId: 'user-sara-ahmed',
          userName: 'Sara Ahmed',
          email: 'sara.ahmed@example.com',
          phone: '+92 321 4567890',
          selectedPlan: '2 Months',
          duration: '2 Months',
          amountPaid: 200,
          paymentStatus: 'Paid',
          paymentMethod: 'Credit Card',
          transactionId: 'TXN-FD-9842',
          paymentDate: now,
          startDate: now,
          expiryDate: twoMonthsLater,
          status: 'Active'
        },
        {
          id: 'FD-SUB-103',
          userId: 'user-ahmed-ali',
          userName: 'Ahmed Ali',
          email: 'ahmed.ali@example.com',
          phone: '+92 333 1122334',
          selectedPlan: '3 Months',
          duration: '3 Months',
          amountPaid: 300,
          paymentStatus: 'Paid',
          paymentMethod: 'Bank Transfer',
          transactionId: 'TXN-FD-9843',
          paymentDate: pastStart,
          startDate: pastStart,
          expiryDate: pastExpiry,
          status: 'Expired'
        }
      ]);
      console.log('📦 Initialized Free Delivery Subscriptions sample data in database');
    }
  } catch (err) {
    console.error('Error seeding MongoDB:', err);
  }
};

module.exports = {
  connectDB,
  Product,
  Order,
  Subscription,
  Discount,
  Review,
  ChatMessage,
  Admin,
  Notification,
  FreeDeliverySub
};
