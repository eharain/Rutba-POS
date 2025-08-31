import React, { useRef, useState } from 'react';


// Strapi-compliant file object builder
import React, { useRef, useState } from 'react';

// Utility functions
const isImage = (file) => file.type.startsWith('image/');
const isPDF = (file) => file.type === 'application/pdf';

// Strapi-compliant file object builder
const buildStrapiFileObj = (file) => ({
    file,
    name: file.name,
    type: file.type,
    size: file.size,
    preview: URL.createObjectURL(file),
});

function FileView({ multiple = false }) {
    const [singleFile, setSingleFile] = useState(null);
    const [galleryFiles, setGalleryFiles] = useState([]);
    const inputRef = useRef();

    const handleChange = (e) => {
        const selectedFiles = Array.from(e.target.files).map(buildStrapiFileObj);
        if (multiple) {
            setGalleryFiles(selectedFiles);
            setSingleFile(null);
        } else {
            setSingleFile(selectedFiles[0] || null);
            setGalleryFiles([]);
        }
    };

    const handleRemove = (index) => {
        setGalleryFiles((prev) => prev.filter((_, i) => i !== index));
    };

    const handleRemoveSingle = () => {
        setSingleFile(null);
    };

    return (
        <div>
            <input
                ref={inputRef}
                type="file"
                accept="image/*,application/pdf"
                multiple={multiple}
                className="d-none"
                onChange={handleChange}
            />
            <button
                type="button"
                onClick={() => inputRef.current.click()}
                className="btn btn-primary mb-3"
            >
                {multiple ? 'Upload Images/PDFs' : 'Upload Image/PDF'}
            </button>

            {/* Single file preview */}
            {!multiple && singleFile && (
                <div className="card mx-auto mb-3" style={{ width: 180, height: 180, position: 'relative' }}>
                    <button
                        type="button"
                        onClick={handleRemoveSingle}
                        className="btn-close position-absolute top-0 end-0 m-2"
                        title="Remove"
                        aria-label="Remove"
                        style={{ zIndex: 2 }}
                    />
                    <div className="d-flex align-items-center justify-content-center h-100">
                        {isImage(singleFile.file) ? (
                            <img
                                src={singleFile.preview}
                                alt={singleFile.name}
                                className="img-fluid h-100 w-100 object-fit-cover"
                                style={{ objectFit: 'cover' }}
                            />
                        ) : isPDF(singleFile.file) ? (
                            <embed
                                src={singleFile.preview}
                                type="application/pdf"
                                width="100%"
                                height="100%"
                                style={{ border: 'none' }}
                            />
                        ) : (
                            <span>Unsupported file</span>
                        )}
                    </div>
                    <div className="card-footer text-center p-2" style={{ fontSize: 13, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {singleFile.name}
                    </div>
                </div>
            )}

            {/* Gallery view for multiple files */}
            {multiple && galleryFiles.length > 0 && (
                <div className="row g-3">
                    {galleryFiles.map((fileObj, idx) => (
                        <div key={idx} className="col-6 col-sm-4 col-md-3">
                            <div className="card position-relative" style={{ width: 140, height: 140 }}>
                                <button
                                    type="button"
                                    onClick={() => handleRemove(idx)}
                                    className="btn-close position-absolute top-0 end-0 m-2"
                                    title="Remove"
                                    aria-label="Remove"
                                    style={{ zIndex: 2 }}
                                />
                                <div className="d-flex align-items-center justify-content-center h-100">
                                    {isImage(fileObj.file) ? (
                                        <img
                                            src={fileObj.preview}
                                            alt={fileObj.name}
                                            className="img-fluid h-100 w-100 object-fit-cover"
                                            style={{ objectFit: 'cover' }}
                                        />
                                    ) : isPDF(fileObj.file) ? (
                                        <embed
                                            src={fileObj.preview}
                                            type="application/pdf"
                                            width="100%"
                                            height="100%"
                                            style={{ border: 'none' }}
                                        />
                                    ) : (
                                        <span>Unsupported file</span>
                                    )}
                                </div>
                                <div className="card-footer text-center p-2" style={{ fontSize: 13, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {fileObj.name}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default FileView;
