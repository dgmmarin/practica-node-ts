import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    UpdateDateColumn,
    ManyToMany,
    JoinTable,
    BeforeInsert,
    OneToMany,
  } from "typeorm";
  import { v4 } from "uuid";
import { Role } from "./Role";
import { Order } from "./Order";
  
  @Entity("users")
  export class User {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column("uuid")
    uuid: string;
  
    @Column({ length: 100, nullable: false })
    firstName: string;
  
    @Column({ length: 100, nullable: false })
    lastName: string;
  
    @Column({ length: 100, nullable: false, unique: true })
    email: string;
  
    @Column({ nullable: false })
    password: string;
  
    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
  
    @DeleteDateColumn()
    deletedAt: Date;
  
    @ManyToMany(() => Role, (role) => role.users)
    @JoinTable({
      name: "user_roles",
      joinColumn: { name: "user_id", referencedColumnName: "id" },
      inverseJoinColumn: { name: "role_id", referencedColumnName: "id" },
    })
    roles: Role[];
  
    @OneToMany(() => Order, (order) => order.user)
    orders: Order[];
  
    @BeforeInsert()
    addUuid() {
      this.uuid = v4();
    }
  }
  