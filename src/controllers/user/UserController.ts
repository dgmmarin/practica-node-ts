import { AppDataSource } from "../../data-source";
import { Order } from "../../database/entities/Order";
import { Role } from "../../database/entities/Role";
import { User } from "../../database/entities/User";
import { CreateUserDto, UpdateUserDto } from "../../dto/user.dto";
import { Process } from "../../interfaces";
import AuthService from "../../utils/AuthService";


class UserController {
  name: string;
  app: Process;
  constructor() {
    this.name = "UserController";
  }

  createUser = async (usr: CreateUserDto): Promise<User> => {
    const user = new User();
    user.firstName = usr.firstName;
    user.lastName = usr.lastName;
    user.email = usr.email;
    user.password = AuthService.hashPassword(usr.password);
    const _user = await AppDataSource.manager.save(user);
    return _user;
  };

  getUser = async (userId: number): Promise<User> => {
    const userRepository = AppDataSource.getRepository(User);
    return await userRepository.findOneOrFail({
      where: { id: userId },
      relations: ["roles", "orders"],
    });
  };

  addRole = async (userId: number, roleId: number): Promise<User> => {
    const roleRepository = AppDataSource.getRepository(Role);
    const role = await roleRepository.findOneOrFail({
      where: { id: roleId },
    });
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOneOrFail({
      where: { id: userId },
      relations: {
        roles: true,
      },
    });
    user.roles.push(role);
    return await userRepository.save(user);
  };

  removeRole = async (userId: number, roleId: number): Promise<User> => {
    const roleRepository = AppDataSource.getRepository(Role);
    const role = await roleRepository.findOneOrFail({
      where: { id: roleId },
    });
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOneOrFail({
      where: { id: userId },
      relations: {
        roles: true,
      },
    });
    user.roles = user.roles.filter((userRole) => userRole.id !== role.id);
    return await userRepository.save(user);
  };

  updateUser = async (
    userId: number,
    updateUserDto: UpdateUserDto,
  ): Promise<User> => {
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOneOrFail({
      where: { id: userId },
      relations: {
        roles: true,
      },
    });
    user.firstName = updateUserDto?.firstName ?? user.firstName;
    user.lastName = updateUserDto?.lastName ?? user.lastName;
    user.email = updateUserDto?.email ?? user.email;
    return await userRepository.save(user);
  };

  deleteUser = async (userId: number): Promise<void> => {
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOneOrFail({ where: { id: userId } });
    await userRepository.softDelete({ id: user.id });
  };

  listUsers = async (): Promise<User[]> => {
    console.log("Listing users");
    const userRepository = AppDataSource.getRepository(User);
    return await userRepository.find();
  };

  getUserByEmail = async (email: string): Promise<User | null> => {
    try {
      const userRepository = AppDataSource.getRepository(User);
      const user = await userRepository.findOneOrFail({
        where: { email: email },
        relations: ["roles"],
      });
      return user;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  listOrders = async (userId: number): Promise<Order[]> => {
    const userRepository = AppDataSource.getRepository(User);
    return (
      await userRepository.findOneOrFail({
        where: { id: Number(userId) },
        relations: ["orders"],
      })
    ).orders;
  };

  getOrder = async (userId: number, orderId: number): Promise<Order> => {
    const user = await AppDataSource.createQueryBuilder(User, "user")
      .leftJoinAndSelect("user.orders", "order")
      .where("user.id = :userId", { userId: userId })
      .andWhere("order.id = :orderId", { orderId: orderId })
      .getOneOrFail();
    return user.orders[0];
  }
}

export default UserController;