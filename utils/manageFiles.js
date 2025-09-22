import multer from "multer";
import path from "path";
import fs from "fs";

const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) {
	fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, uploadsDir); // usar ruta absoluta ya creada
	},
	filename: (req, file, cb) => {
		const uniqueSuffix =
			Date.now() + "-" + Math.round(Math.random() * 1e9);
		cb(null, uniqueSuffix + path.extname(file.originalname));
	},
});

const fileFilter = (req, file, cb) => {
	if (
		file.mimetype.startsWith("image/")
	) {
		cb(null, true);
	} else {
		cb(
			new Error("Solo se permiten archivos de imagen"),
			false
		);
	}
};
const upload = multer({
	storage: storage,
	fileFilter: fileFilter,
});

export const uploadArray = (fieldName, maxCount) => {
	return (req, res, next) => {
		upload.array(fieldName, maxCount)(req, res, (err) => {
			if (err) {
				console.error("Error en Multer:", err.message);
				return res.status(400).json({ message: err.message });
			}
			next();
		});
	};
};
