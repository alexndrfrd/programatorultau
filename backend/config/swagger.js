const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Programatorul Tău API',
            version: '1.0.0',
            description: 'API pentru sistemul de rezervări - Programatorul Tău',
            contact: {
                name: 'API Support',
                email: 'contact@programatorultau.com'
            }
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Development server'
            },
            {
                url: 'https://api.programatorultau.com',
                description: 'Production server'
            }
        ],
        components: {
            schemas: {
                Booking: {
                    type: 'object',
                    required: ['date', 'time', 'name', 'email', 'phone'],
                    properties: {
                        id: {
                            type: 'integer',
                            description: 'Booking ID'
                        },
                        date: {
                            type: 'string',
                            format: 'date',
                            example: '2024-12-20',
                            description: 'Booking date (YYYY-MM-DD)'
                        },
                        time: {
                            type: 'string',
                            pattern: '^\\d{2}:\\d{2}$',
                            example: '10:00',
                            description: 'Booking time (HH:MM)'
                        },
                        name: {
                            type: 'string',
                            minLength: 2,
                            maxLength: 100,
                            example: 'Ion Popescu',
                            description: 'Client name'
                        },
                        email: {
                            type: 'string',
                            format: 'email',
                            example: 'ion@example.com',
                            description: 'Client email'
                        },
                        phone: {
                            type: 'string',
                            minLength: 5,
                            maxLength: 20,
                            example: '+40 123 456 789',
                            description: 'Client phone number'
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Creation timestamp'
                        }
                    }
                },
                Error: {
                    type: 'object',
                    properties: {
                        success: {
                            type: 'boolean',
                            example: false
                        },
                        message: {
                            type: 'string',
                            example: 'Error message'
                        },
                        error: {
                            type: 'string',
                            description: 'Detailed error (only in development)'
                        }
                    }
                },
                ValidationError: {
                    type: 'object',
                    properties: {
                        success: {
                            type: 'boolean',
                            example: false
                        },
                        errors: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    msg: {
                                        type: 'string'
                                    },
                                    param: {
                                        type: 'string'
                                    },
                                    location: {
                                        type: 'string'
                                    }
                                }
                            }
                        }
                    }
                }
            },
            responses: {
                NotFound: {
                    description: 'Resource not found',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/Error'
                            }
                        }
                    }
                },
                ValidationError: {
                    description: 'Validation error',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/ValidationError'
                            }
                        }
                    }
                },
                ServerError: {
                    description: 'Internal server error',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/Error'
                            }
                        }
                    }
                }
            }
        }
    },
    apis: ['./routes/*.js', './server.js']
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;

