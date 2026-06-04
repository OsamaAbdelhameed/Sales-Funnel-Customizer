import { getTranslations } from "next-intl/server";
import { headers } from "next/headers";
import { queryTable } from "@/libs/Spacetime";
import { logger } from "@/libs/Logger";

export const CurrentCount = async () => {
	const t = await getTranslations("CurrentCount");

	// `x-e2e-random-id` is used for end-to-end testing to make isolated requests
	// The default value is 0 when there is no `x-e2e-random-id` header
	const headersList = await headers();
	const id = Number(headersList.get("x-e2e-random-id")) || 0;

	const rows = await queryTable("counter");

	const row = Array.isArray(rows)
		? rows.find((r) => Number(r.id) === id)
		: undefined;
	const count = Number(row?.count ?? 0);

	logger.info("Counter fetched successfully");

	return <div>{t("count", { count })}</div>;
};
