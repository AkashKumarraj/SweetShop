const express = require("express");
const Sweet = require("../models/Sweet");
const { authMiddleware, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

// GET all active sweets (USER + ADMIN)
router.get("/", authMiddleware, async (req, res) => {
    const sweets = await Sweet.findAll({
        where: { isActive: true },
    });
    res.json(sweets);
});


// ADD sweet (ADMIN) — prevent duplicates
router.post("/", authMiddleware, adminOnly, async (req, res) => {
    const { name, category, price, quantity, image } = req.body;

    const existingSweet = await Sweet.findOne({
        where: { name, category },
    });

    if (existingSweet) {
        existingSweet.quantity += quantity;
        await existingSweet.save();
        return res.json({
            message: "Sweet already exists, quantity updated",
            sweet: existingSweet,
        });
    }

    const sweet = await Sweet.create({
        name,
        category,
        price,
        quantity,
        image: image || null,
    });

    res.json(sweet);
});

// PURCHASE sweet
router.post("/:id/purchase", authMiddleware, async (req, res) => {
    const sweet = await Sweet.findByPk(req.params.id);

    if (!sweet || !sweet.isActive || sweet.quantity <= 0) {
        return res.status(400).json({ message: "Out of stock" });
    }

    sweet.quantity -= 1;
    await sweet.save();
    res.json(sweet);
});

// SOFT DELETE (ADMIN)
router.post("/:id/deactivate", authMiddleware, adminOnly, async (req, res) => {
    const sweet = await Sweet.findByPk(req.params.id);
    sweet.isActive = false;
    await sweet.save();
    res.json({ message: "Sweet deactivated" });
});

// RE-ACTIVATE (ADMIN)
router.post("/:id/activate", authMiddleware, adminOnly, async (req, res) => {
    const sweet = await Sweet.findByPk(req.params.id);
    sweet.isActive = true;
    await sweet.save();
    res.json({ message: "Sweet activated" });
});
// GET all sweets (ADMIN - active + inactive)
router.get("/all", authMiddleware, adminOnly, async (req, res) => {
    const sweets = await Sweet.findAll();
    res.json(sweets);
});

// RESTOCK sweet (ADMIN)
router.post("/:id/restock", authMiddleware, adminOnly, async (req, res) => {
    const sweet = await Sweet.findByPk(req.params.id);

    if (!sweet) {
        return res.status(404).json({ message: "Sweet not found" });
    }

    sweet.quantity += 5; // restock by 5
    await sweet.save();

    res.json(sweet);
});


module.exports = router;
