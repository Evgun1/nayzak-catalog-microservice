import { ValidationError } from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";

export function validationExceptionFactory(errors: ValidationError[]) {
	const message = errors.map((err) => {
		return {
			field: err.property,
			message: Object.values(err.constraints || {}).join(", "),
		};
	});
	return new RpcException({
		status: "validation_error",
		error: message,
	});
}
