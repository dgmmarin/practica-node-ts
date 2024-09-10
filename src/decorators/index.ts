/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import { CustomRequest } from "../middlewares/Auth";


export function Body() {
  return function (
    target: unknown,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const value = descriptor.value;
    descriptor.value = function (
      req: Request,
      res: Response,
      next: NextFunction,
    ) {
      console.log(target);
      console.log(propertyKey);
      console.log(descriptor.value);
      const out = value.apply(this, [req, res, next]);
      return out;
    };
    return descriptor;
  };
}

export function Catch(name: any[]) {
  return function (
    target: unknown,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const value = descriptor.value;
    descriptor.value = async function (
      req: Request,
      res: Response,
      next: NextFunction,
    ) {
      try {
        const out = await value.apply(this, [req, res, next]);
        return out;
      } catch (error: any) {
        if (error.name != undefined) {
          if (name.includes(error.name)) {
            return res.status(400).json({ message: error.message });
          } else {
            return res.status(500).json({ message: error });
          }
        } else {
          return res.status(500).json({ message: error });
        }
      }
    };
    return descriptor;
  }
}

export function Roles(roles: string[]) {
  return function (
    target: unknown,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const value = descriptor.value;
    descriptor.value = function (
      req: Request,
      res: Response,
      next: NextFunction,
    ) {
      const _roles = (req as CustomRequest).roles;
      let hasRole = false;
      if (_roles && _roles.length && _roles.some((r) => roles.includes(r))) {
        hasRole = true;
      }
      if (!hasRole) {
        return res.status(403).json({ message: "Unauthorized action" });
      } else {
        const out = value.apply(this, [req, res, next]);
        return out;
      }
    };
    return descriptor;
  };
}

export function HasRole(role: string) {
  return function (
    target: unknown,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const value = descriptor.value;
    descriptor.value = function (
      req: Request,
      res: Response,
      next: NextFunction,
    ) {
      const _roles = (req as CustomRequest).roles;
      let hasRole = false;
      if (_roles && _roles.length && _roles.map((r) => r === role)) {
        hasRole = true;
      }

      if (!hasRole) {
        return res.status(403).json({
          message: `Unauthorized action. The role required for this action is => ${role}`,
        });
      } else {
        const out = value.apply(this, [req, res, next]);
        return out;
      }
    };
  };
}

export const log = (
  target: any | undefined,
  propertyKey: string,
  descriptor: PropertyDescriptor,
): any => {
  // Capture the functional behavior of the decorated method
  const originalMethod = descriptor.value;
  // Override the decorated method's behavior with new behavior
  descriptor.value = function (...args: any[]) {
    let msg: string;
    // The decorated method's parameters will be passed in as args.
    // We'll assume the decorated method might only have a single parameter,
    // check to see if it's been passed in the method
    if (args[0]) {
      msg = `${propertyKey}, that has a parameter value: ${args[0]}`;
    } else {
      msg = `${propertyKey}`;
    }
    // Emit a message to the console
    console.log(`Logger says - calling the method: ${msg}`);
    // Execute the behavior originally programmed in
    // the decorated method
    const result = originalMethod.apply(this, args);
    // if the decorated method returned a value when executed,
    // capture that result
    if (result) {
      msg = `${propertyKey} and returned: ${JSON.stringify(result)}`;
    } else {
      msg = `${propertyKey}`;
    }
    // Having executed the decorated method's behavior, emit
    // a message to the console report what happened
    console.log(`Logger says - called the method: ${msg}`);
    return result;
  };
  return descriptor;
};