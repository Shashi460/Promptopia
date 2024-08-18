import PromptCard from "./PromptCard";
import { useSession } from "next-auth/react";

const Profile = ({ name, desc, data, handleEdit, handleDelete }) => {
  const {data:session} = useSession();
  return (
    <section className='w-full'>
      {session?.user ? (
        <div>
        <h1 className='head_text text-left'>
          <span className='blue_gradient'>{name} Profile</span>
        </h1>
        <p className='desc text-left'>{desc}</p>
  
        <div className='mt-10 prompt_layout'>
          {data.map((post) => (
            <PromptCard
              key={post._id}
              post={post}
              handleEdit={() => handleEdit && handleEdit(post)}
              handleDelete={() => handleDelete && handleDelete(post)}
            />
          ))}
        </div>
        </div>
      ) : (
      <div className="flex flex-1 justify-center items-start w-full h-screen ">
        <h1 className="font-satoshi text-5xl orange_gradient w-full  max-sm:text-2xl">Sign In To Access your Prompts</h1> 
      </div>) 
    }
    </section>
  );
};

export default Profile;