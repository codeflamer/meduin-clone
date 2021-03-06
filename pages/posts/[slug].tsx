import React, { useState } from 'react';
import { sanityClient, urlFor } from '../../lib/sanity';
import { Post } from '../../typings';
import { GetStaticPaths, GetStaticProps } from 'next'
import Header from '../../components/Header';
import PortableText from "react-portable-text";
import { useForm, SubmitHandler } from "react-hook-form";

interface Params{
    params:{
        slug: string;
    }
}
interface Props{
    post:Post;
}

interface IFormInput {
    _id: string;
    name:string;
    email:string;
    comment:string;
}

const Posts = ({post}:Props) => {
    const [submitted,setSubmitted] = useState(false);
    const { register, handleSubmit,formState: { errors } } = useForm<IFormInput>();
    const onSubmit: SubmitHandler<IFormInput> = async(data) => {
        fetch('/api/createComment',{
            method:"POST",
            body:JSON.stringify(data),
        })
        .then(()=>{
            setSubmitted(true);
            console.log(data)
        })
        .catch((err)=>{
            console.log(err);
        })
    }
    console.log(post);
  return (
    <main>
        <Header/>
        <img  className="h-40 w-full object-cover" src={urlFor(post.mainImage).url()!} alt=""/>
        <article className="p-5 max-w-3xl mx-auto">
            <h1 className="text-3xl mt-10 mb-3">{post.title}</h1>
            <h2 className="text-xl font-light text-gray-500 mb-2">{post.description}</h2>
            <div className="flex items-center space-x-2">
                <img className="rounded-full h-10 w-10" src={urlFor(post.author.image).url()!} alt=""/>
                <p className="font-extralight text-sm">
                    Blog post by <span className="text-green-600">{post.author.name}</span> -published at {" "} {new Date(post._createdAt).toLocaleString()}
                </p>
            </div>

            <div className='mt-10'>
                <PortableText
                    className=""
                    content={post.body}
                    projectId={process.env.NEXT_PUBLIC_SANITY_DATASET}
                    dataset={process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}
                    serializers={
                        {
                            h1:(props: any) => {
                                <h1 className="text-2xl font-bold my-5"{...props}/>
                            },
                            h2:(props: any) => {
                                <h1 className="text-xl font-bold my-5"{...props}/>
                            },
                            li:({children}: any) => {
                                <li className="ml-4 list-disc">{children}</li>
                            },
                            link:({href,children}: any) => {
                                <a href={href} className="text-blue-500 hover-underline">{children}</a>
                            },
                            // image:({url}: any) => {
                            //     <img src={urlFor(url).url()!} className="" alt=""/>
                            // }
                        }
                    }
                />
            </div>


        </article>
        <hr className="max-w-lg my-5 mx-auto border border-yellow-500"/>
        
        {submitted ? 
            <div className="flex flex-col p-10 my-10 bg-yellow-500 text-white max-w-2xl mx-auto">
                <h3 className="text-3xl font-bold">Thank you for submitting your comment!</h3>
                <p>Once it has been approved, It will appear below</p>
            </div>
            :
        <form className="flex flex-col p-5 max-w-2xl mx-auto mb-10" onSubmit={handleSubmit(onSubmit)}>
            <h3 className="text-sm text-yellow-500">Enjoy this article</h3>
            <h4 className="text-3xl font-bold">Leave a comment below!</h4>
            <hr className="py-3 mt-2"/>

            <input className=""
                {...register("_id")}
                type="hidden"
                name="_id"
                value={post._id}
            />
            <label className="block mb-5 " htmlFor="">
                <span className="text-gray-700 ">Name</span>
                <input 
                     {...register("name",{required:true})}
                    className="shadow border rounded py-2 px-3 form-input mt-1 block w-full  focus:border-yellow-500 outline-0" placeholder="John Appleseed" type="text"/>
            </label>
            <label className="block mb-5 " htmlFor="">
                <span className="text-gray-700 ">Email</span>
                <input
                    {...register("email",{required:true})} 
                    className="shadow border rounded py-2 px-3 form-input mt-1 block w-full  focus:border-yellow-500  outline-0" placeholder="John Appleseed" type="emai"/>
            </label>
            <label className="block mb-5 " htmlFor="">
                <span className="text-gray-700 ">Comment</span>
                <textarea 
                    {...register("comment",{required:true})}
                    className="shadow border rounded py-2 px-3 form-textarea mt-1 block focus:border-yellow-500 outline-0 w-full"
                    placeholder="John Appleseed" rows={8}/>
            </label>

            <div className="flex flex-col p-5">
                {errors.name && (
                    <span className="text-red-500">This Field is required</span>
                )}
                {errors.comment && (
                    <span className="text-red-500">This Field is required</span>
                )}
                {errors.email && (
                    <span className="text-red-500">This Field is required</span>
                )}
            </div>
            <button type="submit" className="bg-yellow-500 hover:bg-yellow-400 shadow focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded cursor-pointer">Submit</button>
        </form>
        }
        <div className="shadow-yellow-500 flex flex-col p-10 my-10 max-w-2xl mx-auto space-y-2 shadow">
            <h3 className="text-4xl">Comments</h3>
            <hr className="pb-2"/>
            {post.comments.map((comment)=>(
                <div key={comment._id} className="">
                    <p><span className="text-yellow-500">{comment.name}</span>:{comment.comment}</p>
                </div>
            ))}
        </div>
    </main>
  )
}

export const getStaticPaths:GetStaticPaths = async() =>{
    const query = `
        *[_type == "post"]{
        _id,
        slug
        {
            current
        }
    }
  `;
    const posts = await sanityClient.fetch(query);

    // Get the paths we want to pre-render based on posts
    const paths = posts.map((post:Post) => ({
      params: { slug: post.slug.current },
    }))
  
    // We'll pre-render only these paths at build time.
    // { fallback: blocking } will server-render pages
    // on-demand if the path doesn't exist.
    return { paths, fallback: 'blocking' }
  }

  export const getStaticProps = async({params}:Params) => {
    const query = `
        *[_type == "post" && slug.current == $slug]{
        _id,
       _createdAt,
       title,
       author ->{
           name,
           image
       },
       'comments':*[
           _type == "comment" &&
           post._ref == ^._id &&
           approved == false
       ],
       description,
       mainImage,
       slug,
       body
    }[0]
  `;
    const post = await sanityClient.fetch(query,{
        slug:params.slug
    })
    if(!post){
        return {
            notFound:true,
        }
    }
    return{
        props: { post },
        revalidate:60
    }
  }

export default Posts