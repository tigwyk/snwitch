# Copilot Instructions for snwitch

## Project Overview
snwitch is a tool designed to monitor and track users who moderate for Twitch streamers. This project helps identify and report on moderator activity across different channels.

## Development Guidelines

### Code Style
- Follow consistent naming conventions throughout the codebase
- Write clear, self-documenting code with meaningful variable and function names
- Add comments for complex logic or non-obvious behavior
- Keep functions focused on a single responsibility

### Best Practices
- Write modular, reusable code
- Handle errors gracefully with appropriate error messages
- Validate all user inputs
- Follow security best practices, especially when handling user data or API credentials
- Keep dependencies up to date

### Testing
- Write tests for new features and bug fixes
- Ensure tests are maintainable and cover edge cases
- Run tests before committing changes

### Documentation
- Update README.md when adding new features or changing functionality
- Document any setup requirements or configuration options
- Include usage examples for new features

### Git Workflow
- Write clear, descriptive commit messages
- Keep commits focused on a single change or feature
- Reference issue numbers in commits when applicable

## Project-Specific Context
- This project interfaces with Twitch's platform
- Moderator tracking should respect privacy and Twitch's terms of service
- Handle rate limiting appropriately when making API calls
- Consider performance when tracking multiple channels or users
