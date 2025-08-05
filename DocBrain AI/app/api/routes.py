from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from app.services.pdf_service import PDFService
from app.services.model_service import ModelService
from app.config import logger, flow_logger
from app.utils.Dto.ChatDto import ChatModelResponseDto, ChatRequestDto

router = APIRouter()
pdf_service = PDFService()
model_service = ModelService()


@router.post("/process-pdf")
async def process_pdf(
        file: UploadFile = File(...),
        documentId: int = Form(...)
):
    try:
        flow_logger.info(f"Received PDF processing request from Spring Boot - Document ID: {documentId}")

        # Validate file type
        if not file.filename.endswith('.pdf'):
            flow_logger.error(f"Invalid file type: {file.filename} - Expected PDF")
            raise HTTPException(status_code=400, detail="File must be a PDF")

        # Step 1: Extract text from PDF
        flow_logger.info(f"Starting PDF text extraction - File: {file.filename}")
        text = await pdf_service.read_pdf(file)
        logger.info(f"Successfully extracted text from PDF, length: {len(text)} characters")
        flow_logger.info(f"PDF text extraction completed - {len(text)} characters extracted")

        # Step 2: Process chunks and generate embeddings
        flow_logger.info("Starting chunk generation and embedding")
        chunks = pdf_service.prepare_chunks_with_embeddings(text)
        logger.info(f"Generated {len(chunks)} chunks with embeddings")
        flow_logger.info(f"Generated {len(chunks)} chunks with embeddings")

        # Step 3: Process with model for summary, keywords, and analysis
        flow_logger.info("Starting document analysis with model")
        analysis_results = await model_service.process_document(text[:4096])  # Use a portion for analysis
        logger.info("Generated document analysis with model")
        flow_logger.info("Document analysis completed successfully")

        # Step 4: Combine results
        flow_logger.info("Preparing results for Spring Boot")
        results = {
            "documentId": documentId,
            "chunks": chunks,
            "summary": analysis_results.get("summary", ""),
            "keywords": analysis_results.get("keywords", [])
            # "analysis": analysis_results.get("analysis", "")
        }

        # Step 5: Send results back to Spring Boot
        flow_logger.info(f"Sending results to Spring Boot - Document ID: {documentId}")
        await pdf_service.send_results_to_spring(results, documentId)
        logger.info("Sent processing results to Spring Boot")
        flow_logger.info(f"Results successfully sent to Spring Boot - Document ID: {documentId}")

        return {"status": "success", "message": "PDF processed successfully"}

    except ValueError as e:
        logger.error(f"Invalid document ID format: {documentId}")
        flow_logger.error(f"ERROR: Invalid document ID format: {documentId}")
        raise HTTPException(status_code=400, detail="Invalid document ID format")
    except Exception as e:
        logger.error(f"Error processing PDF: {str(e)}", exc_info=True)
        flow_logger.error(f"ERROR: PDF processing failed - {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/chat", response_model=ChatModelResponseDto)
async def chat_with_document(request: ChatRequestDto):
    try:
        logger.info(f"Received chat request for document {request.documentId}")
        logger.info(f"Number of chunks received: {len(request.chunks)}")
        flow_logger.info(f"Received chat request from Spring Boot - Document ID: {request.documentId}, Chunks: {len(request.chunks)}")
        flow_logger.info(f"User prompt: '{request.prompt[:50]}...' (truncated)")

        # Format conversation history
        conversation_history = []
        for msg in request.history:
            role = "user" if msg.userMessage else "assistant"
            conversation_history.append({"role": role, "content": msg.content})

        flow_logger.info(f"Conversation history: {len(request.history)} messages")

        # Sort chunks by order if needed
        chunks = sorted(request.chunks, key=lambda x: x.chunkOrder)
        chunk_contents = [chunk.content for chunk in chunks]
        flow_logger.info(f"Prepared {len(chunks)} document chunks for context")

        # Generate response
        flow_logger.info("Starting chat response generation")
        response = await model_service.generate_chat_response(
            document=chunk_contents,
            user_message=request.prompt,
            conversation_history=conversation_history
        )
        flow_logger.info(f"Chat response generated successfully - Length: {len(response)} characters")

        # Return response to Spring Boot
        flow_logger.info("Sending chat response back to Spring Boot")
        return ChatModelResponseDto(content=response)

    except Exception as e:
        logger.error(f"Error in chat endpoint: {str(e)}", exc_info=True)
        flow_logger.error(f"ERROR: Chat response generation failed - {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
