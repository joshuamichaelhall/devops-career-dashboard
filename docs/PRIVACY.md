# Privacy and Data Ownership

The DevOps Career Dashboard is designed with strong privacy boundaries to ensure your personal career data remains under your exclusive control while allowing others to benefit from the codebase.

## How Data Privacy Works

1. **Data Storage Isolation**
   - All personal dashboard data is stored locally on your system
   - Data files are excluded from the Git repository via `.gitignore`
   - Career metrics, skills, and tracking information never leave your environment

2. **Authentication System**
   - All data modification endpoints require authentication
   - Only users with admin credentials can update dashboard data
   - Each person creates their own credentials during setup
   - The setup process generates unique encryption keys and JWT secrets

3. **Environment Configuration**
   - Sensitive configuration is stored in `.env` files (excluded via `.gitignore`)
   - API keys are stored using AES-256-GCM encryption with your own key
   - The repository includes only `.env.example` with placeholder values

## For Repository Users

When someone clones or forks this repository:

1. **They get code, not data**
   - No personal career data is included in the repository
   - They start with empty data structures they'll populate themselves
   - Your dashboard metrics, skills, and logs remain private to you

2. **They create their own identity**
   - They'll run `npm run setup-admin` to create their own admin account
   - They'll generate their own encryption keys and secrets
   - Their authentication system is completely separate from yours

3. **They configure their own environment**
   - They'll create their own `.env` file based on the example
   - They can connect their own external services (like Clay CRM)
   - Their instance will be uniquely configured for their use

## For Repository Owners

As the owner of your dashboard instance:

1. **You control all updates**
   - Only you (with your admin credentials) can modify your dashboard data
   - Updates to metrics, skills, and logs are protected by authentication
   - Even if you make the dashboard publicly viewable, updates remain restricted

2. **Your data stays private**
   - When you push code changes to GitHub, your personal data stays local
   - API keys and secrets remain in your `.env` file (not in the repository)
   - Backup files are also excluded from the repository

3. **You determine visibility**
   - You can choose to make a live view-only version available
   - You control what data is displayed publicly vs. kept private
   - Authentication ensures only you can make changes

## Best Practices

For maximum privacy and security:

1. **Never commit `.env` files** to the repository
2. **Regularly review `.gitignore`** to ensure sensitive data is excluded
3. **Enable HTTPS** in production to protect data in transit
4. **Store backups securely** as they contain your personal career data
5. **Regularly rotate passwords** and encryption keys for enhanced security

By following these practices, you ensure that your career dashboard remains a personal tool under your exclusive control while allowing others to benefit from the codebase for their own career development.

---

*Note: While this system provides strong boundaries for personal data, always review code before running it on your system, especially code that handles sensitive personal information.*