use spacetimedb::{spacetimemodule, Table};

#[spacetimemodule]
pub mod main {
    use super::*;

    #[spacetimedb(table)]
    pub struct Organization {
        #[spacetimedb(primarykey)]
        pub id: String, // Clerk Org ID
        pub name: String,
        pub stripe_customer_id: Option<String>,
    }

    #[spacetimedb(table)]
    pub struct Project {
        #[spacetimedb(primarykey)]
        pub id: u64,
        pub org_id: String,
        pub project_type: String, // "website", "pdf", "funnel"
        pub name: String,
        pub content: String, // JSON or HTML
    }

    #[spacetimedb(table)]
    pub struct Counter {
        // Keep it simple: a single counter row per id
        #[spacetimedb(primarykey)]
        pub id: u64,
        pub count: i64,
        pub updated_at: i64, // epoch micros from reducer timestamp
        pub created_at: i64, // epoch micros from reducer timestamp
    }

    #[spacetimedb(reducer)]
    pub fn create_organization(ctx: ReducerContext, id: String, name: String) -> Result<(), String> {
        Organization::insert(Organization {
            id,
            name,
            stripe_customer_id: None,
        })?;
        Ok(())
    }

    #[spacetimedb(reducer)]
    pub fn save_project(
        ctx: ReducerContext,
        org_id: String,
        project_type: String,
        name: String,
        content: String,
    ) -> Result<(), String> {
        // Simple insert or update logic could go here
        Project::insert(Project {
            id: ctx.timestamp.as_micros() as u64,
            org_id,
            project_type,
            name,
            content,
        })?;
        Ok(())
    }

    #[spacetimedb(reducer)]
    pub fn increment_counter(
        ctx: ReducerContext,
        id: u64,
        increment: i64,
    ) -> Result<i64, String> {
        let ts = ctx.timestamp.as_micros() as i64;

        // SpacetimeDB reducers support reading tables and inserting/updating.
        // Insert if missing (best-effort), then update.
        if Counter::get(id).is_err() {
            Counter::insert(Counter {
                id,
                count: 0,
                created_at: ts,
                updated_at: ts,
            })?;
        }

        let current = Counter::get(id)?.count;
        let next = current + increment;

        Counter::update(id, Counter {
            id,
            count: next,
            created_at: Counter::get(id)?.created_at,
            updated_at: ts,
        })?;

        Ok(next)
    }
}

pub struct ReducerContext {
    pub timestamp: std::time::Duration,
}
