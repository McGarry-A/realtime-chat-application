exports.fetchUsers = async (io, room) => {
    try {
        const clientsInRoom = await io.in(room).allSockets();
        return clientsInRoom.size;
    } catch (error) {
        console.log(error);
    }
};
