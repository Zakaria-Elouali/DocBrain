//package ai.docbrain.service.utils;
//
//import java.io.ByteArrayOutputStream;
//import java.io.IOException;
//import java.util.List;
//import java.util.zip.ZipEntry;
//import java.util.zip.ZipOutputStream;
//
//public class DocZipper {
//
//    public static byte[] createZipFromDocuments(List<Document> documents) {
//        try (ByteArrayOutputStream baos = new ByteArrayOutputStream();
//             ZipOutputStream zos = new ZipOutputStream(baos)) {
//
//            for (Document document : documents) {
//                ZipEntry entry = new ZipEntry(document.getName());
//                entry.setSize(document.getFileData().length);
//                zos.putNextEntry(entry);
//                zos.write(document.getFileData());
//                zos.closeEntry();
//            }
//
//            zos.finish();
//            return baos.toByteArray();
//
//        } catch (IOException e) {
//            throw new RuntimeException("Error creating zip from documents", e);
//        }
//    }
//
//    /*public static byte[] createZipFromDecryptedFiles(List<byte[]> decryptedFiles, List<Document> documents) throws DocumentException {
//        try (ByteArrayOutputStream baos = new ByteArrayOutputStream();
//             ZipOutputStream zos = new ZipOutputStream(baos)) {
//
//            AtomicInteger index = new AtomicInteger(0);
//            for (byte[] decryptedFile : decryptedFiles) {
//                Document document = documents.get(index.getAndIncrement());
//                ZipEntry entry = new ZipEntry(document.getName());
//                entry.setSize(decryptedFile.length);
//                zos.putNextEntry(entry);
//                zos.write(decryptedFile);
//                zos.closeEntry();
//            }
//
//            zos.finish();
//            return baos.toByteArray();
//
//        } catch (IOException e) {
//            throw new DocumentException("Error creating zip from decrypted files", e);
//        }
//    }*/
//
//    public static byte[] createZipFromDecryptedFiles(List<byte[]> decryptedFiles, List<String> fileNames) throws DocumentException {
//        if (decryptedFiles.size() != fileNames.size()) {
//            throw new DocumentException("Mismatch between number of decrypted files and file names.");
//        }
//
//        try (ByteArrayOutputStream baos = new ByteArrayOutputStream();
//             ZipOutputStream zos = new ZipOutputStream(baos)) {
//
//            for (int i = 0; i < decryptedFiles.size(); i++) {
//                byte[] decryptedFile = decryptedFiles.get(i);
//                String fileName = fileNames.get(i);
//
//                // Create a ZipEntry with the decrypted file name
//                ZipEntry entry = new ZipEntry(fileName);
//                entry.setSize(decryptedFile.length);  // Set the size of the entry
//                zos.putNextEntry(entry);               // Start the zip entry
//                zos.write(decryptedFile);               // Write the decrypted file data
//                zos.closeEntry();                       // Close the zip entry
//            }
//
//            zos.finish();  // Finish the ZIP output stream
//            return baos.toByteArray();  // Return the byte array of the ZIP file
//
//        } catch (IOException e) {
//            throw new DocumentException("Error creating zip from decrypted files", e);
//        }
//    }
//}