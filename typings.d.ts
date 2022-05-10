export interface Post {
    _id:string;
    title:string;
    description:string;
    _createdAt:string;
    author:{
        name:string;
        image:string;
    };
    comments:Comment[];
    mainImage:{
        assert:{
            url:string;
            //_ref
        };
    };
    slug:{
        current:string;
    }
    body:object[],
    
}

export interface Comment{
    approved:boolean;
    comment:string;
    email:string;
    name:string;
    post:{
        _ref:string,
        _type:string
    };
    _createdAt:string;
    _id:string;
    _rev:string;
    _type:string;
    _updatedAt:string;
}