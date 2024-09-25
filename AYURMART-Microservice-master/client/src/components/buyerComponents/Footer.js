import React from 'react';
import { Container, Grid, Typography, Button, Link, FormControl, InputLabel, OutlinedInput, Box } from '@mui/material';

function Footer() {
    return (
        <Box width="100%" style={{ backgroundColor: '#eee', paddingX: '24px', marginTop: '50px', bottom:'0' }}>
            <Container maxWidth="xl">
                <Grid container spacing={5}>
                    <Grid item xs={12} md={4}>
                        <Typography variant="h5" component="h3" style={{ fontWeight: 'bold', marginBottom: '16px' }}>
                            AYURMART
                        </Typography>
                        <Typography variant="body1" component="p" style={{ marginBottom: '16px' }}>
                            We specialize in herb-based products that are natural, sustainable, and beneficial for your health.
                        </Typography>
                        <Link href="/about" color="primary" variant="body2" style={{ marginRight: '8px' }}>
                            About Us
                        </Link>
                        <Link href="/contact" color="primary" variant="body2" style={{ marginRight: '8px' }}>
                            Contact Us
                        </Link>
                    </Grid>

                    <Grid item xs={12} md={2}>
                        <Typography variant="h6" component="h3" style={{ fontWeight: 'bold', marginBottom: '16px' }}>
                            Shop by category
                        </Typography>
                        <div>
                            <Link href="/category1" style={{ display: 'block', margin: '8px 0', color: '#616161', textDecoration: 'none', '&:hover': { color: '#000' } }}>
                                Skin Care
                            </Link>
                            <Link href="/category2" style={{ display: 'block', margin: '8px 0', color: '#616161', textDecoration: 'none', '&:hover': { color: '#000' } }}>
                                Hair Care
                            </Link>
                            <Link href="/category3" style={{ display: 'block', margin: '8px 0', color: '#616161', textDecoration: 'none', '&:hover': { color: '#000' } }}>
                                Foot Care
                            </Link>
                        </div>
                    </Grid>

                    <Grid item xs={12} md={2}>
                        <Typography variant="h6" component="h3" style={{ fontWeight: 'bold', marginBottom: '16px' }}>
                            Shop by Brand
                        </Typography>
                        <div>
                            <Link href="/category1" style={{ display: 'block', margin: '8px 0', color: '#616161', textDecoration: 'none', '&:hover': { color: '#000' } }}>
                                Gold
                            </Link>
                            <Link href="/category2" style={{ display: 'block', margin: '8px 0', color: '#616161', textDecoration: 'none', '&:hover': { color: '#000' } }}>
                                Sierra
                            </Link>
                            <Link href="/category3" style={{ display: 'block', margin: '8px 0', color: '#616161', textDecoration: 'none', '&:hover': { color: '#000' } }}>
                                Cosrx
                            </Link>
                        </div>
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Typography variant="h6" component="h3" style={{ fontWeight: 'bold', marginBottom: '16px' }}>
                            Subscribe to our newsletter
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <FormControl fullWidth sx={{ mr: 1 }}>
                                <InputLabel>Email</InputLabel>
                                <OutlinedInput label="Email" />
                            </FormControl>
                            <Button variant="contained" style={{padding: "15px", backgroundColor: '#2196f3', color: '#fff', '&:hover': { backgroundColor: '#1976d2' } }}>
                                Subscribe
                            </Button>
                        </Box>
                    </Grid>

                </Grid>
                <Typography variant="body2" component="p" style={{ marginTop: '16px', paddingBottom: '20px' }}>
                    © 2023 Herb Shop. All rights reserved.
                </Typography>
            </Container>
        </Box>
    );
}

export default Footer;
