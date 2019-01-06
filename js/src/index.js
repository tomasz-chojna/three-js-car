Physijs.scripts.worker = './js/libs/physijs_worker.js';
Physijs.scripts.ammo = './js/libs/ammo.js';

const createWorld = () => {
    const scene =  new THREE.Scene();

    // FOV is the extent of the scene that is seen on the display at any given moment. The value is in degrees.
    const fovInDegrees = 45;
    const aspectRatio = window.innerWidth / window.innerHeight;

    // Objects below/above the values won't be rendered
    const nearRenderingLimit = 0.1; 
    const farRenderingLimit = 1000;

    const camera = new THREE.PerspectiveCamera(fovInDegrees, aspectRatio, nearRenderingLimit, farRenderingLimit);

    const renderer = new THREE.WebGLRenderer();
    renderer.gammaOutput = true;
    renderer.gammaFactor = 2.2;
    renderer.setClearColor(new THREE.Color('white'));
    renderer.shadowMap.enabled = true;
    renderer.autoClear = true;
    renderer.autoClearColor = true;

    const modelLoader = new THREE.GLTFLoader();

    const objects = {};

    return {
        scene,
        camera,
        renderer,
        modelLoader,
        objects,
        addObject: (key, obj) => {
            objects[key] = obj;
        }
    }
}

const createAnimation = (world) => {
    const animate = () => {
        requestAnimationFrame(animate);

        world.renderer.render(world.scene, world.camera);

        if (world.objects.car) {
            world.camera.lookAt(world.objects.car.position);
            world.objects.light.target = world.objects.car;
        }
    }

    return animate;
}

const renderInDOM = (world) => {
    world.renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( world.renderer.domElement );
}

const renderGround = (world) => {
    const planeGeometry = new THREE.PlaneGeometry(60, 20, 5, 5);
    const planeMaterial = new THREE.MeshPhongMaterial({color: 0x666666, side:THREE.DoubleSide});
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.receiveShadow = true;

    plane.rotation.x = -0.5 * Math.PI;
    plane.position.x = 15
    plane.position.y = 0
    plane.position.z = 0

    world.scene.add(plane);
}

const initializeControls = (world) => {
    window.addEventListener('keydown', (e) => {
        const LEFT = 37;
        const UP = 38;
        const RIGHT = 39;
        const DOWN = 40;
        
        const car = world.objects.car;

        if (e.keyCode == UP) {
            car.position.z += 1;
            // world.camera.position.z += 1;
        } else if (e.keyCode == DOWN) {
            car.position.z -= 1;
            // world.camera.position.z -= 1;
        } else if (e.keyCode == RIGHT) {
            car.position.x -= 1;
            // world.camera.position.x -= 1;
        } else if (e.keyCode == LEFT) {
            car.position.x += 1;
            // world.camera.position.x += 1;
        }
    }, false);
};

const renderCar = (world) => {
    world.modelLoader.load('models/car/scene.gltf', (gltf) => {
        console.log('Car initialized');
        const car = gltf.scene;
        
        // var mesh = new Physijs.BoxMesh(car, new THREE.MeshFaceMaterial());
        // mesh.position.y = 2;
        // mesh.castShadow = mesh.receiveShadow = true;

        // vehicle = new Physijs.Vehicle(car, new Physijs.VehicleTuning(
        //     10.88,
        //     1.83,
        //     0.28,
        //     500,
        //     10.5,
        //     6000
        // ));

        car.position.x -= 1.25;
        car.position.y = 0;
        car.position.z = 0;

        world.scene.add(car);
        world.addObject('car', car);

        initializeControls(world);

        world.camera.position.y = 4;
        world.camera.position.z = 15;

        // world.camera.rotation.x = 1;
    }, () => {}, err => console.error(err));
}

const renderRoad = (world) => {
    world.modelLoader.load('models/road_straight/scene.gltf', (gltf) => {
        console.log('Road initialized');
        const road = gltf.scene;
        road.scale.x = 0.20;
        road.scale.y = 0.20;

        world.scene.add(road);
        world.addObject('road', road);

        world.camera.position.y = 2;
        world.camera.position.z = 15;
    }, () => {}, err => console.error(err));
}

const renderBuilding = (world) => {
    world.modelLoader.load('models/modern_office/scene.gltf', (gltf) => {
        console.log('Building initialized');
        const building = gltf.scene;
        // road.scale.x = 0.20;
        // road.scale.y = 0.20;

        building.position.y = 0;

        world.scene.add(building);
        world.addObject('building', building);

    }, () => {}, err => console.error(err));
}

const renderLight = (world) => {
    const spotLight = new THREE.SpotLight(0xffffff, 2);
    spotLight.position.set(-40, 60, -10);
    spotLight.castShadow = true;

    spotLight.angle = 0.6;
    spotLight.exponent = 25;

    world.scene.add(spotLight);
    world.addObject('light', spotLight);
}

const world = createWorld();
renderInDOM(world);
renderLight(world);
renderCar(world);
renderRoad(world);

const animation = createAnimation(world);
animation();