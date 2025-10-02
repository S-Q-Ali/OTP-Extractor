const { readUsers, writeUsers } = require("./userHelpers");
const bcrypt = require("bcrypt");
const speakeasy = require("speakeasy");
const qrcode = require("qrcode");

async function createInitialAdmin() {
  try {
    const users = await readUsers();
    const adminEmail = "umarvamatters@gmail.com";
    const adminPassword = "Umar1234@";

    if (users.users[adminEmail]) {
      console.log("Admin user already exists");
      return;
    }

    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    const secret = speakeasy.generateSecret({
      name: `OTP-App (${adminEmail})`,
    });
    const qrCodeDataUrl = await qrcode.toDataURL(secret.otpauth_url);

    users.users[adminEmail] = {
      id: adminEmail,
      adminEmail,
      name: "Admin user",
      password: hashedPassword,
      secret: secret.base32,
      qrCode: qrCodeDataUrl,
      is_verified: false,
      role: "admin",
      status: "active",
      created_at: new Date().toISOString(),
      last_login: null,
      updated_at: new Date().toISOString(),
    };

    await writeUsers(users);

    console.log("✅ Admin user created successfully!");
    console.log("📧 Email:", adminEmail);
    console.log("🔑 Password:", adminPassword);
    console.log("📱 Scan the QR code in your app to setup 2FA");
    console.log("🚀 After setup, login and you'll see 'Manage Users' button");
  } catch (error) {
    console.log("Falied to create admin");
  }
}

createInitialAdmin();

module.exports={createInitialAdmin};
