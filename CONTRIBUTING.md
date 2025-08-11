# Contributing to Campus Q&A Library

Thank you for your interest in contributing to Campus Q&A Library! This document provides guidelines and information for contributors.

## 🎯 How to Contribute

### Types of Contributions We Welcome
- 🐛 Bug fixes
- ✨ New features
- 📚 Documentation improvements  
- 🎨 UI/UX enhancements
- 🔧 Performance optimizations
- 🌍 Accessibility improvements
- 📱 Mobile responsiveness fixes

## 🚀 Getting Started

### 1. Fork & Clone
```bash
git clone https://github.com/YOUR_USERNAME/campus-q-and-a-library.git
cd campus-q-and-a-library
```

### 2. Set Up Environment
```bash
npm install
# Copy .env.example to .env and add your keys
cp .env.example .env
```

### 3. Create a Branch
```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

## 📋 Development Guidelines

### Code Style
- Use consistent indentation (2 spaces)
- Follow semantic HTML practices
- Use CSS custom properties for theming
- Write clean, readable JavaScript (ES6+)
- Comment complex logic

### Commit Messages
Follow conventional commits:
```
feat: add search functionality to Q&A library
fix: resolve mobile responsive issues
docs: update setup instructions
style: improve purple theme consistency
```

### Testing Your Changes
1. Test on multiple browsers (Chrome, Firefox, Safari)
2. Verify mobile responsiveness
3. Test with and without JavaScript enabled
4. Ensure accessibility standards

## 🎨 Design Guidelines

### Color Palette
```css
--primary: #8B5FBF;     /* Main purple */
--secondary: #D4B5F7;   /* Light purple */
--accent: #F7E8FF;      /* Very light purple */
--text: #2A1B3D;        /* Dark text */
--text-light: #6B5B73;  /* Light text */
```

### Component Standards
- Maintain consistent border-radius (8px, 12px)
- Use subtle shadows and transitions
- Ensure 4.5:1 contrast ratio minimum
- Follow mobile-first responsive design

## 🐛 Bug Reports

### Before Submitting
- Check existing issues
- Test on latest version
- Verify the bug in multiple browsers

### Bug Report Template
```markdown
**Describe the bug**
A clear description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior

**Expected behavior**
What you expected to happen

**Screenshots**
If applicable, add screenshots

**Environment:**
- Browser: [e.g. Chrome 91]
- OS: [e.g. Windows 10]
- Device: [e.g. iPhone 12]
```

## 💡 Feature Requests

### Feature Request Template
```markdown
**Feature Description**
Clear description of the proposed feature

**Problem it Solves**
What problem does this feature address?

**Proposed Solution**
How would you like it implemented?

**Alternative Solutions**
Any alternative approaches considered?

**Additional Context**
Screenshots, mockups, or examples
```

## 🔍 Priority Areas for Contribution

### High Priority
- [ ] User authentication system
- [ ] Advanced search filters
- [ ] Question categorization improvements
- [ ] Mobile app version (PWA)
- [ ] Offline functionality

### Medium Priority
- [ ] Dark mode support
- [ ] Export functionality
- [ ] Question rating system
- [ ] Multi-language support
- [ ] Better error handling

### Documentation
- [ ] Video tutorials
- [ ] API documentation
- [ ] Deployment guides
- [ ] Troubleshooting guide

## 🏆 Recognition

Contributors will be:
- Listed in our README.md
- Mentioned in release notes
- Eligible for contributor badges
- Invited to join our Discord community

## 📞 Getting Help

- 💬 Open a [Discussion](https://github.com/YOUR_USERNAME/campus-q-and-a-library/discussions)
- 📧 Email: your-email@example.com
- 🐦 Twitter: [@YourHandle](https://twitter.com/YourHandle)

## 📄 Code of Conduct

### Our Standards
- Be respectful and inclusive
- Focus on constructive feedback
- Help others learn and grow
- Maintain professionalism

### Unacceptable Behavior
- Harassment or discrimination
- Offensive comments or personal attacks  
- Spam or promotional content
- Sharing private information

---

By contributing, you agree that your contributions will be licensed under the MIT License.

**Happy Contributing! 🎉**
