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
    pub fn save_project(ctx: ReducerContext, org_id: String, project_type: String, name: String, content: String) -> Result<(), String> {
        // Simple insert or update logic could go here
        Project::insert(Project {
            id: ctx.timestamp.as_micros(),
            org_id,
            project_type,
            name,
            content,
        })?;
        Ok(())
    }
}

pub struct ReducerContext {
    pub timestamp: std::time::Duration,
}
