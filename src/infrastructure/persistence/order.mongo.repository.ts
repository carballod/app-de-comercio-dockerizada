import { Types } from "mongoose";
import { IOrderRepository } from "../../application/repository/order.repository";
import { Order as OrderInterface } from "../../interfaces/order.interface";
import { Order } from "../schemas/order/order.schema";

export class OrderMongoRepository implements IOrderRepository {
  private documentToInterface(doc: any): OrderInterface {
    try {
      return {
        id: doc._id.toString(),
        userId: doc.userId
          ? doc.userId._id
            ? doc.userId._id.toString()
            : doc.userId.toString()
          : "Usuario eliminado",
        products: (doc.products || []).map((product: any) => ({
          productId: product.productId?._id
            ? product.productId._id.toString()
            : product.productId?.toString() || "Producto eliminado",
          quantity: product.quantity,
          price: product.price,
        })),
        totalAmount: doc.totalAmount,
        status: doc.status,
        date: doc.date,
      };
    } catch (error) {
      console.error(
        "Error converting document to interface:",
        error,
        "Document:",
        doc
      );
      throw new Error(`Error converting order document: ${error}`);
    }
  }

  async findAll(): Promise<OrderInterface[]> {
    const orders = await Order.find()
      .populate("userId")
      .populate("products.productId")
      .sort({ date: -1 })
      .lean();
    return orders.map((order) => this.documentToInterface(order));
  }

  async findById(id: string): Promise<OrderInterface | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    const order = await Order.findById(id)
      .populate("userId")
      .populate("products.productId")
      .lean();
    return order ? this.documentToInterface(order) : null;
  }

  async findByUserId(userId: string): Promise<OrderInterface[]> {
    if (!Types.ObjectId.isValid(userId)) return [];
    const orders = await Order.find({ userId })
      .populate("products.productId")
      .sort({
        date: -1,
      })
      .lean();

    return orders.map((order) => this.documentToInterface(order));
  }

  async save(order: Omit<OrderInterface, "id">): Promise<OrderInterface> {
    const newOrder = new Order({
      ...order,
      userId: new Types.ObjectId(order.userId),
      products: order.products.map((product) => ({
        ...product,
        productId: new Types.ObjectId(product.productId),
      })),
    });

    const savedOrder = await newOrder.save();
    await (await savedOrder.populate("userId")).populate("products.productId");

    return this.documentToInterface(savedOrder);
  }

  async update(
    id: string,
    orderData: Partial<Omit<OrderInterface, "id">>
  ): Promise<OrderInterface | null> {
    if (!Types.ObjectId.isValid(id)) return null;

    const updateData: any = { ...orderData };
    if (updateData.userId) {
      updateData.userId = new Types.ObjectId(updateData.userId);
    }
    if (updateData.products) {
      updateData.products = updateData.products.map((product: any) => ({
        ...product,
        productId: new Types.ObjectId(product.productId),
      }));
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    )
      .populate("userId")
      .populate("products.productId")
      .lean();

    return updatedOrder ? this.documentToInterface(updatedOrder) : null;
  }

  async deleteById(id: string): Promise<boolean> {
    if (!Types.ObjectId.isValid(id)) return false;
    const result = await Order.deleteOne({ _id: id });
    return result.deletedCount > 0;
  }

  async cancelOrder(id: string): Promise<OrderInterface | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { $set: { status: "cancelled" } },
      { new: true }
    )
      .populate("userId")
      .populate("products.productId")
      .lean();

    return updatedOrder ? this.documentToInterface(updatedOrder) : null;
  }
}
