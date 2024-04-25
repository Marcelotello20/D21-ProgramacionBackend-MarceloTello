import express from "express";
import __dirname from '../utils/utils.js';
// import CartManager from "../dao/CartManagerFS.js";
import CartManagerDB from "../dao/CartManagerDB.js"

const router = express.Router();
const cartsRouter = router;
// const CM  = new CartManager(`${__dirname}/Carts.json`);
const CM = new CartManagerDB();

router.post("/", async (req, res) => {
    try {
        const newCart = await CM.createCart();
        res.status(200).json(newCart);
    } catch (error) {
        console.error("Error al crear el carrito", error);
        res.status(500).send("Error al crear el carrito");
    }
});

router.get("/", async (req, res) => {
    try {
        const cart = await CM.getCarts();

        if (!cart) {
            console.error("No se pudo encontrar el carrito con ID:", cartId);
            return res.status(404).json({
                error: `No se encontró el carrito con ID ${cartId}`
            });
        }

        return res.json(cart);
    } catch (error) {
        console.error("Error al obtener el carrito:", error);
        return res.status(500).send("Error interno del servidor");
    }
});

router.get("/:cid", async (req, res) => {
    //FS
    // const cartId = +req.params.cid;
    //DB
    const cartId = req.params.cid;

    try {
        const cart = await CM.getCartById(cartId);

        if (!cart) {
            console.error("No se pudo encontrar el carrito con ID:", cartId);
            return res.status(404).json({
                error: `No se encontró el carrito con ID ${cartId}`
            });
        }

        return res.json(cart);
    } catch (error) {
        console.error("Error al obtener el carrito:", error);
        return res.status(500).send("Error interno del servidor");
    }
});

router.post("/:cid/product/:pid", async (req, res) => {
    //FS
    // const cartId = +req.params.cid;
    // const productId = +req.params.pid;

    //DB
    const cartId = req.params.cid;
    const productId = req.params.pid;

    const { quantity } = req.body;

    
    try {
        await CM.addProductToCart(cartId, productId, quantity);
        res.status(200).send("Producto agregado al carrito");
    } catch (error) {
        console.error("Error al agregar producto al carrito", error);
        res.status(500).send("Error al agregar producto al carrito", error);
    }
});

router.delete('/:cid/product/:pid', async (req, res) => {
    //DB
    const cartId = req.params.cid;
    const productId = req.params.pid;
    
    try {
        
        await CM.removeProductFromCart(cartId, productId);
        res.send('Producto eliminado del carrito correctamente');
    } catch (error) {
        console.error("Error al eliminar el producto del carrito:", error);
        res.status(500).send('Error al eliminar el producto del carrito');
    }
});

// PUT api/carts/:cid/products/:pid deberá poder actualizar SÓLO la cantidad de ejemplares del producto por cualquier cantidad pasada desde req.body
router.put('/:cid/products/:pid', async (req, res) => {
    //DB
    const cartId = req.params.cid;
    const productId = req.params.pid;

    const { quantity } = req.body;

    try {
        
        await CM.updateProductQuantity(cartId, productId, quantity);
        res.send('Cantidad de producto actualizada correctamente');
    } catch (error) {
        console.error("Error al actualizar la cantidad del producto:", error);
        res.status(500).send('Error al actualizar la cantidad del producto');
    }
});

// Eliminar carrito
router.delete('/:cid', async (req, res) => {
    //DB
    const cartId = req.params.cid;

    try {
        await CM.deleteCart(cartId);
        res.send('Productos eliminados del carrito correctamente');
    } catch (error) {
        console.error("Error al eliminar los productos del carrito:", error);
        res.status(500).send('Error al eliminar los productos del carrito');
    }
});



export default cartsRouter;
