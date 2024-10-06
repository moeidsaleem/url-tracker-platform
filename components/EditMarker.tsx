import { useState } from "react";
import { database } from "../lib/firebase";
import { ref, update } from "firebase/database";

interface EditMarkerProps {
    markerId: string;
}

const EditMarker: React.FC<EditMarkerProps> = ({ markerId }) => {
    const [name, setName] = useState('');
    const [category, setCategory] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        update(ref(database, 'locations/' + markerId), {
            name,
            category,
        });
    };

    return (
        <form onSubmit={handleSubmit}>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Marker Name" />
            <input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Category" />
            <button type="submit">Update Marker</button>
        </form>
    );
};

export default EditMarker;
