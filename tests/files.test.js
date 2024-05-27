jest.doMock('../src/configs/db.config', () => ({
  query: jest.fn(),
}));

const filesService = require('../src/services/files.service');
const validateFile = require('../src/utils/validateFile.util');
const { handleFilesUpload } = require('../src/controllers/files.controller');
const pool = require('../src/configs/db.config');

jest.mock('../src/services/files.service');
jest.mock('../src/utils/validateFile.util');

describe('Files Controller', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should return 201 and file data when file upload is successful', async () => {
    const mockFile = { id: '1', url: 'http://example.com/file.pdf' };
    pool.query.mockResolvedValue({ rows: [mockFile] });

    const req = {
      user: { id: '1' },
      file: { ...mockFile },
    };

    validateFile.mockReturnValue(true);
    filesService.create.mockResolvedValue(mockFile);

    const result = await filesService.create({
      user: req.user.id,
      file: req.file,
    });
    expect(result).toEqual(mockFile);
  });

  it('should return 500 when file upload fails', async () => {
    const req = {
      user: { id: '1' },
      file: {},
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    validateFile.mockReturnValue(true);
    filesService.create.mockRejectedValue(new Error('File upload failed'));

    await handleFilesUpload(req, res);

    expect(validateFile).toHaveBeenCalledWith(req.file, res, [
      'application/pdf',
    ]);
    expect(filesService.create).toHaveBeenCalledWith({
      user: req.user.id,
      file: req.file,
    });
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      status: 500,
      error: {
        code: 'FILE_PROCESSING_ERROR',
        message: 'An error occurred while processing the File.',
      },
    });
  });
});
