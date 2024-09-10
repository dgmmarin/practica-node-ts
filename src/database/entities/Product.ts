import {
    BeforeInsert,
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinTable,
    ManyToMany,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
  } from "typeorm";
import { Category } from "./Category";
import { OrderProducts } from "./OrderProduct";
import { v4 } from "uuid";
  
  @Entity("products")
  export default class Product {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column("uuid")
    uuid: string;
  
    @Column({ length: 100, nullable: false })
    name: string;
  
    @Column({ nullable: false, default: 0 })
    price: number;
  
    @Column({ length: 255, nullable: false })
    description: string;
  
    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
  
    @DeleteDateColumn()
    deletedAt: Date;
  
    @ManyToMany(() => Category, (category) => category.products)
    @JoinTable({
      name: "product_categories",
      joinColumn: { name: "product_id", referencedColumnName: "id" },
      inverseJoinColumn: { name: "category_id", referencedColumnName: "id" },
    })
    category: Category[];
  
    @OneToMany(() => OrderProducts, (orderProduct) => orderProduct.product)
    orderProducts: OrderProducts[];
  
    @BeforeInsert()
    addUuid() {
      this.uuid = v4();
    }
  }
  