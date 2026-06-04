import { headers } from "next/headers";
import { NextResponse } from "next/server";
import * as z from "zod";
import { logger } from "@/libs/Logger";
import { CounterValidation } from "@/validations/CounterValidation";
import { callReducer } from "@/libs/Spacetime";

export const PUT = async (request: Request) => {
	const json = await request.json();
	const parse = CounterValidation.safeParse(json);

	if (!parse.success) {
		return NextResponse.json(z.treeifyError(parse.error), { status: 422 });
	}

	// `x-e2e-random-id` is used for end-to-end testing to make isolated requests
	// The default value is 0 when there is no `x-e2e-random-id` header
	const headersList = await headers();
	const id = Number(headersList.get("x-e2e-random-id")) || 0;

	let nextCount: number;
	try {
		nextCount = await callReducer("main.increment_counter", [
			id,
			parse.data.increment,
		]);
	} catch {
		nextCount = await callReducer("increment_counter", [
			id,
			parse.data.increment,
		]);
	}

	logger.info("Counter has been incremented");

	return NextResponse.json({
		count: nextCount,
	});
};
