import { Router } from "express";
import { CheckResultsController } from "./checkResults.controller";
import multer from "multer";

const router = Router();
const checkResultsController = new CheckResultsController();

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed"));
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

router.post(
  "/check",
  upload.single("pdf"),
  checkResultsController.checkDocument
);
router.get("/history", checkResultsController.getHistory);

export default router;
