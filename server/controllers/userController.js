import asyncHandler from 'express-async-handler'

import {prisma} from "../config/prismaConfig.js"

export const createUser = asyncHandler(async (req, res) => {
    console.log("create a user");

    let {email} = req.body;
    const userExists = await prisma.user.findUnique({where: {email:email}})

    if (!userExists){
        const user = await prisma.user.create({data: req.body});
        res.send({
            message: "User registered successfully",
            user: user,
        });
    }
    else res.status(201).json({message: "USer already exists"})

});

//function to book a visit to residency
export const bookVisit = asyncHandler(async(req, res) => {
    const {email, date} = req.body
    const {id} = req.params

    try {
        
        const alreadybooked = await prisma.user.findUnique({
            where : {email},
            select : {bookVisits: true}
        })

        if(alreadybooked.bookVisits.some((visits) => visits.id === id)){
            res.status(400).json({message : "this residency is already booked by you"})
        }
        else{
            await prisma.user.update({
                where: {email : email},
                data : {
                    bookVisits: {push : {id,date}}
                },
            });
            res.send("your visit is booked successfully")
        }
    } catch (err) {
        throw new Error(err.message)
    }
})

export const allBookings = asyncHandler(async(req, res) => {
    const {email} = req.body
    try {
        const bookings  = await prisma.user.findUnique({
            where : {email},
            select : {bookVisits: true}
        })
        res.status(200).send(bookings)
    } catch (err) {
        throw new Error(err.message);
    }
})

export const cancelBookings = asyncHandler(async(req,res) => {

    const {email} = req.body;
    const {id} = req.params;
    try {
        const user = await prisma.user.findUnique({
            where : {email:email},
            select : {bookVisits:true}
        })
    const index = user.bookVisits.findIndex((visits) => visits.id === id)
    if (index === -1){
        res.status(404).json({message:"Booking not found"})
    }else{
        user.bookVisits.splice(index,1)
        await prisma.user.update({
            where : {email},
            data : {
                bookVisits: user.bookVisits
            }
        })
        res.send("Booking cancelled successfully ")
    }
    } catch (err) {
        throw new Error(err.message)
    }

})

//function to add a residency in favourites
export const toFav = asyncHandler(async(req, res) => {
    const {email} = req.body;
    const {rid} = req.params;

    try {
        const user = await prisma.user.findUnique({
            where : {email}
        })

        if (user.favResidenciesID.includes(rid)){
            const updateUser = await prisma.prisma.update({
                where : {email},
                data : {
                    favResidenciesID : {
                        set: user.favResidenciesID.filter((id) => id !== rid)
                    }
                }
            });

            res.send({message : "Removed from favs", user : updateUser})
        }else{
            const updateUser = await prisma.user.update({
                where : {email},
                data : {
                    favResidenciesID : {
                        push : rid
                    }
                }
            })
            res.send({message : "Updated favs", user: updateUser})
        }

    } catch (err) {
        throw new Error(err.message);
    }
})

//function to get all favs
export const allfavs = asyncHandler(async(req,res) => {
    const {email} = req.body;
    try {
        const fav_res = await prisma.user.findUnique({
            where: {email},
            select: {favResidenciesID : true}
        })
    res.status(200).send(fav_res)
    } catch (err) {
        throw new Error(err.message)
    }
})