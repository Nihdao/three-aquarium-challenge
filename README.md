# 🐠 Aquarium In and Out

> **🏆 3rd Place Winner** of [Bruno Simon's 19th Three.js Journey Challenge](https://threejs-journey.com/challenges/019-aquarium) - Aquarium Theme

An immersive 3D aquarium experience where you can swim as a fish. Dive into a realistic underwater world with physics-based swimming and dynamic water effects.

## ✨ Features

- 🐟 **Immersive Fish POV Camera** - Experience the aquarium from a fish's perspective
- 🏊 **Physics-Based Swimming** - Realistic movement with React Three Rapier
- 🤖 **NPC Fishes with Behavioral Patterns** - NPC fishes with autonomous behavior
- 🌊 **Water Wave Post-Processing Effects** - Dynamic water surface with realistic waves
- 📱 **Responsive Touch Controls** - Works seamlessly on desktop and mobile
- 🎮 **Interactive Controls** - WASD/Arrow keys for movement, Space/C for vertical swimming

## 🛠️ Built With

- **React Three Fiber / Three.js** - 3D rendering engine
- **React Three Drei** - Utilities and helpers
- **React Three Rapier** - Physics simulation
- **Zustand** - State management
- **Leva** - Debug controls
- **Vite** - Build tool and dev server

## 🎨 3D Assets

The project includes custom Blender `.glb` models:

- **Fish Models** by Quaternius (ButterflyFish, Goldfish, MandarinFish)
- **Aquarium Tank** - Custom modeled fish tank
- **Environment Textures** - Baked lighting and materials

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 🎮 Controls

- **WASD / Arrow Keys** - Move forward/backward/left/right
- **Space** - Swim up
- **C** - Swim down
- **Shift** - Swim faster
- **Mouse** - Look around (when in first-person mode)

## 🐛 Debug Mode

Add `#debug` to the URL to access:

- Performance monitoring
- Physics collider visualization
- Advanced controls and settings

## 🌊 Water Shader

Special thanks to [Dan Greenheck's threejs-water-shader](https://github.com/dgreenheck/threejs-water-shader) for the realistic water surface effects.

## 👨‍💻 Author

**Adam Alet** - [@nihdao](https://x.com/nihdao)

## 📄 License

This project is created for educational purposes as part of the Three.js Journey course.

---

_Big kudos to the Three.js community for inspiration and support!_ 🎉
