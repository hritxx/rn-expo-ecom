import { Product } from "../models/product.model.js";
import { Order } from "../models/order.model.js";
import { User } from "../models/user.model.js";
import cloudinary from "../config/cloudinary.js";

export async function createProduct(req, res) {
  try {
    const { name, description, price, stock, category } = req.body;
    if (!name || !description || !price || !stock || !category)
      return res.status(400).json({ message: "All fields are required" });

    if (!req.files || req.files.length == 0)
      return res
        .status(400)
        .json({ message: "At least one image is required" });

    if (req.files.length > 3)
      return res.status(400).json({ message: "Maximum 3 images allowed" });

    const uploadPromises = req.files.map((file) => {
      return cloudinary.uploader.upload(file.path, {
        folder: "products",
      });
    });

    const uploadResults = await Promise.all(uploadPromises);

    // secure_url
    const imageUrls = uploadResults.map((result) => result.secure_url);
    const product = await Product.create({
      name,
      description,
      price,
      stock,
      category,
      images: imageUrls,
    });
    return res.status(201).json(product);
  } catch (error) {
    console.error("Error in create product controller", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function getAllProducts(_req, res) {
  try {
    // -1 means in desc order: most recent products first
    const products = await Product.find().sort({ createdAt: -1 });
    return res.status(200).json(products);
  } catch (error) {
    console.error("Error in get all products controller", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function updateProduct(req, res) {
  try {
    const { id } = req.params;
    const { name, description, price, stock, category } = req.body;

    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    if (name) product.name = name;
    if (description) product.description = description;
    if (price) product.price = price;
    if (stock != undefined) product.stock = parseInt(stock);
    if (category) product.category = category;

    // handle image updates if new images are updated
    if (req.files && req.files.length > 0) {
      if (req.files.length > 3)
        return res.status(400).json({ message: "Maximum 3 files allowed" });

      const uploadPromises = req.files.map((file) =>
        cloudinary.uploader.upload(file.path, {
          folder: "products",
        })
      );

      //       const uploadPromises = req.files.map((file) =>
      //   cloudinary.uploader.upload(file.path, { folder: "products" })
      // );

      const uploadResults = await Promise.all(uploadPromises);

      product.images = uploadResults.map((result) => result.secure_url);
    }
    await product.save();
    return res.status(200).json(product);
  } catch (error) {
    console.error("Error in update product controller", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function getAllOrders(_req, res) {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("orderItems.product")
      .sort({ createdAt: -1 });
    return res.status(200).json(orders);
  } catch (error) {
    console.error("Error in get all orders controller", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function updateOrderStatus(req, res) {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    if (!["pending", "shipped", "delivered"].includes(status))
      return res.status(400).json({ message: "Invalid status" });
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = status;

    if (status === "shipped" && !order.shippedAt) {
      order.shippedAt = new Date();
    }
    if (status === "delivered" && !order.deliveredAt) {
      order.deliveredAt = new Date();
    }
    await order.save();
    return res
      .status(200)
      .json({ message: "Order status updated successfully" });
  } catch (error) {
    console.error("Error in update order status controller", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function getAllCustomers(_, res) {
  try {
    const customers = await User.find().sort({ createdAt: -1 });
    return res.status(200).json(customers);
  } catch (error) {
    console.error("Erron in getAllCustomers controller");
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function getDashboardStats(_, res) {
  try {
    const totalOrders = await Order.countDocuments();

    const revenueResult = await Order.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: "$totalPrice" },
        },
      },
    ]);

    const totalRevenue = revenueResult[0]?.total || 0;

    const totalCustomers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();

    return res.status(200).json({
      totalRevenue,
      totalOrders,
      totalCustomers,
      totalProducts,
    });
  } catch (error) {
    console.error("Error in getDashboardStats controller", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
