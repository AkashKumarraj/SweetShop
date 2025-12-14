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
    try {
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

        const sweetData = {
            name: String(name),
            category: String(category),
            price: parseFloat(price),
            quantity: parseInt(quantity),
        };

        if (image && typeof image === 'string' && image.trim() !== "") {
            sweetData.image = image.trim();
        }

        const sweet = await Sweet.create(sweetData);

        res.json(sweet);
    } catch (error) {
        console.error("Error creating sweet:", error);
        res.status(500).json({ message: "Error creating sweet", error: error.message });
    }
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

// DELETE sweet permanently (ADMIN)
router.delete("/:id", authMiddleware, adminOnly, async (req, res) => {
    const sweet = await Sweet.findByPk(req.params.id);

    if (!sweet) {
        return res.status(404).json({ message: "Sweet not found" });
    }

    await sweet.destroy();
    res.json({ message: "Sweet deleted permanently" });
});


module.exports = router;
