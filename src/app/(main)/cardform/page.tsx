import { createClient } from "@/utils/supabase/server";
import AddCard from "@/components/stripe/AddCard";
const cardForm = async () => {
    const supabase = createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();
    console.log("userdsfa")

    return (
        <div className="space-y-3">
            <h1 className="text-2xl font-bold mb-6 text-center">Add Payment Method</h1>
            <AddCard userId={user?.id}/>
        </div>
    );
};

export default cardForm;
