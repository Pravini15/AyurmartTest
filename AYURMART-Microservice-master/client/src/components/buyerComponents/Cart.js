import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuthContext } from "../../hooks/useAuthContext";
import { Box, Button, Card, CardContent, Grid, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import CircularProgress from '@mui/material/CircularProgress';
import { Link } from 'react-router-dom';

const CartPage = () => {
    const { user } = useAuthContext();
    const [cart, setCart] = useState(null);
    const [textFieldValue, setTextFieldValue] = useState('');
    const [couponApplied, setCouponApplied] = useState(false);
    const [cartTotal, setCartTotal] = useState(0);


    useEffect(() => {
        const fetchCart = async () => {
            try {
                const token = user.token;
                const config = {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                };
                const response = await axios.get(
                    "http://localhost:7001/api/checkout/cart",
                    config
                );
                setCart(response.data);
                const total = response.cartTotal;
                setCartTotal(total);
            } catch (error) {
                console.log(error.message);
            }
        };

        fetchCart();
    }, [user]);

    const handleRemove = async (productId) => {
        try {
            const token = user.token;
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            };
            const response = await axios.put(
                `http://localhost:7001/api/checkout/cart/${productId}`,
                {},
                config
            );
            if (response) {
                const updatedCart = response.data.updatedCart;
                const newCartTotal = calculateCartTotal(updatedCart.products);

                setCart((prevCart) => ({
                    ...prevCart,
                    cartTotal: newCartTotal,
                    products: prevCart.products.filter(
                        (item) => item.product._id !== productId
                    ),
                }));
            }
        } catch (error) {
            console.log(error.message);
        }
    };

    const calculateCartTotal = (products) => {
        let cartTotal = 0;
        for (let i = 0; i < products.length; i++) {
            cartTotal += products[i].price * products[i].count;
        }
        return cartTotal;
    };

    const handleApplyCoupon = async () => {
        const requestBody = { coupon: textFieldValue };
        const token = user.token;

        const value = await axios.post('http://localhost:7001/api/checkout/cart/applycoupon', requestBody, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            }
        })
            .then((response) => {
                console.log(response.data);
                setCouponApplied(true)
                setTimeout(function () {
                    window.location.reload();
                }, 2000);
            })
            .catch((error) => {
                console.error(error);
            });
    };

    const handleRemoveAll = async () => {
        const token = user.token;

        const value = await axios.delete('http://localhost:7001/api/checkout/empty-cart', {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            }
        })
            .then((response) => {
                console.log(response.data);
                setCart(null);
            })
            .catch((error) => {
                console.error(error);
            });
    };

    const handleTextFieldChange = (event) => {
        setTextFieldValue(event.target.value);
    };

    // const handleCheckout = async () => {
    //     const stripe = getStripe();
    //     const response = await fetch('http://localhost:7001/api/checkout/create-checkout-session', {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json',
    //         },
    //         body: JSON.stringify(cart.products),
    //     });
    //     console.log(response);

    //     if (response.statusCode === 500) return;

    //     const data = await response.json();
    //     console.log(data);
    //     stripe.redirectToCheckout({ sessionId: data.id });
    // }

    const createOrder = (data, actions) => {
        return actions.order
          .create({
            purchase_units: [
              {
                description: `AyurMart`,
                amount: {
                  currency_code: "USD",
                  value: cart.cartTotal
                },
              },
            ],
            // not needed if a shipping address is actually needed
            application_context: {
              shipping_preference: "NO_SHIPPING",
            },
          })
      };

    return (
        <Grid container sx={{ mt: 20 }}>
            <Grid item md={8} xs={12} px={3}>
                <Card>
                    <CardContent style={{ textAlign: 'center' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="h5" sx={{ mb: '20px', textAlign: 'left', fontWeight: "900" }}>Shopping Cart</Typography>
                            <Button sx={{ textAlign: 'right' }} onClick={handleRemoveAll}>Remove All</Button>
                        </Box>
                        {cart ? (
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Image</TableCell>
                                            <TableCell>Product</TableCell>
                                            <TableCell>Unit Price</TableCell>
                                            <TableCell>Quantity</TableCell>
                                            <TableCell>Total</TableCell>
                                            <TableCell></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {cart.products.map((item) => (
                                            <TableRow key={item._id}>
                                                <TableCell>
                                                    <img src={item.product.images[0].url} alt={item.product.title} style={{ width: "50px" }} />
                                                </TableCell>
                                                <TableCell>{item.product.title}</TableCell>
                                                <TableCell>Rs.{item.product.price}.00</TableCell>
                                                <TableCell>{item.count}</TableCell>
                                                <TableCell>Rs.{item.product.price * item.count}.00</TableCell>
                                                <TableCell>
                                                    <IconButton onClick={() => handleRemove(item.product._id)}>
                                                        <DeleteIcon color="error" />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        ) : (
                            <CircularProgress />
                        )}
                    </CardContent>
                </Card>
            </Grid>

            <Grid item md={4} xs={12} px={3}>
                <Card sx={{ mb: "20px", px: '20px' }}>
                    <CardContent>
                        <Typography variant="h5" sx={{ mb: '20px', textAlign: 'left', fontWeight: "900" }}>Apply Coupon</Typography>
                        <Box sx={{ display: 'flex', '& > :not(style)': { m: 1 }, }} >
                            <TextField size="small" label="Code" fullWidth value={textFieldValue} onChange={handleTextFieldChange} />
                            <Button color="warning" variant="contained" sx={{ px: "60px" }} onClick={handleApplyCoupon}>Apply</Button>
                        </Box>
                    </CardContent>
                </Card>
                <Card sx={{ px: '20px', mb: "100px" }}>
                    <CardContent>
                        <Typography variant="h5" sx={{ mb: '20px', textAlign: 'left', fontWeight: "900" }}>Order Summary</Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: "30px" }}>
                            <Typography variant="body1" sx={{ mb: '20px', textAlign: 'left', fontWeight: "900" }}>Items Total</Typography>
                            <Typography sx={{ textAlign: 'right' }}>Rs.{cart && cart.cartTotal && cart.tax ? cart.cartTotal - cart.tax : 0}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="body1" sx={{ mb: '20px', textAlign: 'left', fontWeight: "900" }}>Discount</Typography>
                            <Typography color="error" sx={{ textAlign: 'right' }}> - Rs.{cart && cart.cartTotal && cart.totalAfterDiscount ? cart.cartTotal - cart.totalAfterDiscount : 0}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="body1" sx={{ mb: '20px', textAlign: 'left', fontWeight: "900" }}>Tax</Typography>
                            <Typography color="error" sx={{ textAlign: 'right' }}> + Rs.{cart && cart.tax ? cart.tax : 0}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="body1" sx={{ mb: '20px', textAlign: 'left', fontWeight: "900" }}>Net Total</Typography>
                            <Typography sx={{ textAlign: 'right' }}>Rs.{cart && cart.cartTotal && cart.totalAfterDiscount ? cart.totalAfterDiscount : cart && cart.cartTotal ? cart.cartTotal : 0}</Typography>
                        </Box>
                        <h3 align="center" fullWidth variant="contained" color="success">Proceed Checkout with</h3>

                        <Button color="success" variant="contained" sx={{px:"180px"}} LinkComponent={Link} to={`/payment/${cart}`}> PayNow </Button>
                    </CardContent>
                    <CardContent>

                    </CardContent>
                </Card>
            </Grid>


        </Grid>
    );
};

export default CartPage;
