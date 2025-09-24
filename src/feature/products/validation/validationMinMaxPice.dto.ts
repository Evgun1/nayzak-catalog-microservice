import { PartialType } from "@nestjs/swagger";
import { ValidationProductsByParamsParamDTO } from "./validationProductsByParams.dto";

export class ValidationMinMaxPriceParamDTO extends PartialType(
	ValidationProductsByParamsParamDTO,
) {}
