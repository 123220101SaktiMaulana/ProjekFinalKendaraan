import Favorite from "../models/FavoriteModel.js";
import Vehicle from "../models/VehicleModel.js";

// Tambah kendaraan ke favorit
export const addFavorite = async (req, res) => {
    const {
        userId,
        vehicleId
    } = req.body;
    try {
        // Cek apakah sudah difavoritkan sebelumnya
        const existing = await Favorite.findOne({
            where: {
                userId,
                vehicleId
            }
        });
        if (existing) {
            return res.status(400).json({
                message: "Sudah ada di favorit."
            });
        }

        const favorite = await Favorite.create({
            userId,
            vehicleId
        });
        res.status(201).json(favorite);
    } catch (error) {
        res.status(500).json({
            message: "Gagal menambahkan ke favorit",
            error
        });
    }
};

// Ambil semua kendaraan favorit milik user
export const getFavoritesByUser = async (req, res) => {
    const {
        userId
    } = req.params;
    try {
        const favorites = await Favorite.findAll({
            where: {
                userId
            },
            include: [{
                model: Vehicle
            }]
        });
        res.status(200).json(favorites);
    } catch (error) {
        res.status(500).json({
            message: "Gagal mengambil data favorit",
            error
        });
    }
};


export const deleteFavorite = async (req, res) => {
    const {
        userId,
        vehicleId
    } = req.body; // data dikirim lewat body

    try {
        const favorite = await Favorite.findOne({
            where: {
                userId,
                vehicleId
            }
        });
        if (!favorite) {
            return res.status(404).json({
                message: "Favorite tidak ditemukan"
            });
        }

        await favorite.destroy();
        return res.status(200).json({
            message: "Favorite berhasil dihapus"
        });
    } catch (error) {
        return res.status(500).json({
            message: "Terjadi kesalahan server",
            error: error.message
        });
    }
};