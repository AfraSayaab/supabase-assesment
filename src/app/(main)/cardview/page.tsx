
import { createClient } from "@/utils/supabase/server";
import CardList from "@/components/stripe/CardList";
const cardForm = async () => {
    const supabase = createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();
    console.log("userdsfa")

    return (
        <div className="space-y-3">
            <h1 className="text-2xl font-bold mb-6 text-center">View Attach Card</h1>
            <CardList userId={user?.id}/>
        </div>
    );
};

export default cardForm;
