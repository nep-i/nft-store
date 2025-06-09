import { BaseModel } from "./base.model";

export class Metadata {
  constructor(
    public params: {
      createdAt?: Date;
      updatedAt?: Date;
      timestamp?: number;
      modified?: boolean;
      extraData?: any;
    } = {}
  ) {}

  public static deserialize(input: any): Metadata {
    return new Metadata({
      createdAt: input.createdAt ? new Date(input.createdAt) : undefined,
      updatedAt: input.updatedAt ? new Date(input.updatedAt) : undefined,
      timestamp: input.timestamp,
      modified: input.modified,
      extraData: input.extraData,
    });
  }
}

export class Chat extends BaseModel {
  constructor(
    public params: {
      id?: string;
      participants: User[];
      messages?: Message[];
      metadata?: Metadata;
    }
  ) {
    super(params);
  }

  public static deserialize(input: any): Chat {
    return new Chat({
      id: input.id,
      participants: input.participants.map((user: any) =>
        User.deserialize(user)
      ),
      messages: input.messages.map((message: any) =>
        Message.deserialize(message)
      ),
      metadata: input.metadata
        ? Metadata.deserialize(input.metadata)
        : undefined,
    });
  }
}

export class Post extends BaseModel {
  constructor(
    public params: {
      id?: string;
      user: User;
      message: Message;
      replies?: Message[];
      metadata?: Metadata;
      timestamp: Date;
    }
  ) {
    super(params);
  }

  public static deserialize(input: any): Post {
    return new Post({
      id: input.id,
      user: User.deserialize(input.user),
      message: Message.deserialize(input.message),
      replies: input.replies
        ? input.replies.map((reply: any) => Message.deserialize(reply))
        : [],
      metadata: input.metadata
        ? Metadata.deserialize(input.metadata)
        : undefined,
      timestamp: new Date(input.timestamp),
    });
  }
}

export class Feed extends BaseModel {
  constructor(
    public params: { id?: string; posts: Post[]; metadata?: Metadata }
  ) {
    super(params);
  }

  public static deserialize(input: any): Feed {
    return new Feed({
      id: input.id,
      posts: input.posts.map((post: any) => Post.deserialize(post)),
      metadata: input.metadata
        ? Metadata.deserialize(input.metadata)
        : undefined,
    });
  }
}

type BidHistory = {
  userId: number;
  price: number;
};

export class Product extends BaseModel {
  constructor(
    public params: {
      id?: string;
      name: string;
      owner: User;
      startingPrice: number;
      currentPrice: number;
      bidHistory: BidHistory[];
      metadata?: Metadata;
      reviews?: { user: User; rating: number; comment: string }[];
      artUrl: string;
      artBlob?: Buffer;
    }
  ) {
    super(params);
  }

  public static deserialize(input: any): Product {
    return new Product({
      id: input.id,
      name: input.name,
      owner: User.deserialize(input.owner),
      startingPrice: input.startingPrice,
      currentPrice: input.currentPrice,
      bidHistory: input.bidHistory || [],
      metadata: input.metadata
        ? Metadata.deserialize(input.metadata)
        : undefined,
      reviews: input.reviews
        ? input.reviews.map((review: any) => ({
            user: User.deserialize(review.user),
            rating: review.rating,
            comment: review.comment,
          }))
        : [],
      artUrl: input.artUrl,
      artBlob: input.artBlob,
    });
  }
}

export class Cart extends BaseModel {
  constructor(
    public params: {
      id?: string;
      user: User;
      products: Product[];
      metadata?: Metadata;
    }
  ) {
    super(params);
  }

  public static deserialize(input: any): Cart {
    return new Cart({
      id: input.id,
      user: User.deserialize(input.user),
      products: input.products.map((product: any) =>
        Product.deserialize(product)
      ),
      metadata: input.metadata
        ? Metadata.deserialize(input.metadata)
        : undefined,
    });
  }
}

export class Favorites extends BaseModel {
  constructor(
    public params: {
      id?: string;
      user: User;
      favoriteProducts: Product[];
      metadata?: Metadata;
    }
  ) {
    super(params);
  }

  public static deserialize(input: any): Favorites {
    return new Favorites({
      id: input.id,
      user: User.deserialize(input.user),
      favoriteProducts: input.favoriteProducts.map((product: any) =>
        Product.deserialize(product)
      ),
      metadata: input.metadata
        ? Metadata.deserialize(input.metadata)
        : undefined,
    });
  }
}

export class Transaction extends BaseModel {
  constructor(
    public params: {
      id?: string;
      buyer: User;
      seller: User;
      product: Product;
      amount: number;
      date: Date;
      metadata?: Metadata;
    }
  ) {
    super(params);
  }

  public static deserialize(input: any): Transaction {
    return new Transaction({
      id: input.id,
      buyer: User.deserialize(input.buyer),
      seller: User.deserialize(input.seller),
      product: Product.deserialize(input.product),
      amount: input.amount,
      date: new Date(input.date),
      metadata: input.metadata
        ? Metadata.deserialize(input.metadata)
        : undefined,
    });
  }
}

export class TransactionHistory extends BaseModel {
  constructor(
    public params: {
      id?: string;
      user: User;
      transactions: Transaction[];
      metadata?: Metadata;
    }
  ) {
    super(params);
  }

  public static deserialize(input: any): TransactionHistory {
    return new TransactionHistory({
      id: input.id,
      user: User.deserialize(input.user),
      transactions: input.transactions.map((transaction: any) =>
        Transaction.deserialize(transaction)
      ),
      metadata: input.metadata
        ? Metadata.deserialize(input.metadata)
        : undefined,
    });
  }
}

export class User extends BaseModel {
  constructor(
    public params: {
      id?: string;
      username?: string;
      email?: string;
      productsForSale?: Product[];
      chats?: Chat[];
      feed?: Feed;
      productsOwn?: Product[];
      metadata?: Metadata;
    }
  ) {
    super(params);
  }

  public static deserialize(input: any): User {
    return new User({
      id: input.id,
      username: input.username,
      email: input.email,
      productsForSale: input.productsForSale
        ? input.productsForSale.map((product: any) =>
            Product.deserialize(product)
          )
        : [],
      chats: input.chats
        ? input.chats.map((chat: any) => Chat.deserialize(chat))
        : [],
      feed: input.feed ? Feed.deserialize(input.feed) : undefined,
      productsOwn: input.productsOwn
        ? input.productsOwn.map((product: any) => Product.deserialize(product))
        : [],
      metadata: input.metadata
        ? Metadata.deserialize(input.metadata)
        : undefined,
    });
  }
}

export class Message extends BaseModel {
  constructor(
    public params: {
      id?: string;
      chatId: string;
      sender: User;
      content: string;
      typeMessage: "permanent" | "temporary";
      timestamp: Date;
      metadata?: Metadata;
    }
  ) {
    super(params);
  }

  public static deserialize(input: any): Message {
    return new Message({
      id: input.id,
      sender: User.deserialize(input.sender),
      chatId: input.chatId,
      typeMessage: input.typeMessage,
      content: input.content,
      timestamp: new Date(input.timestamp),
      metadata: input.metadata
        ? Metadata.deserialize(input.metadata)
        : undefined,
    });
  }
}
