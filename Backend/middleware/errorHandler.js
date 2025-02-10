export const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    
    if (err.name === 'ValidationError') {
      return res.status(400).json({
        message: 'Validation Error',
        details: Object.values(err.errors).map(e => e.message)
      });
    }
  
    if (err.name === 'CastError') {
      return res.status(400).json({
        message: 'Invalid ID format'
      });
    }
  
    res.status(500).json({
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  };