import {
    BeforeInsert,
    Column,
    CreateDateColumn,
    Entity,
    ManyToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
  } from "typeorm";
  import { v4 } from "uuid";
import { Role } from "./Role";
  
  @Entity("permissions")
  export class Permission {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column("uuid")
    uuid: string;
  
    @Column()
    name: string;
  
    @Column()
    description: string;
  
    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
  
    @ManyToMany(() => Role, (role) => role.permissions)
    roles: Permission[];
  
    @BeforeInsert()
    addUuid() {
      this.uuid = v4();
    }
  }
  