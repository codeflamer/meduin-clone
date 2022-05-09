export interface Post {
    _id:string;
    title:string;
    description:string;
    author:{
        name:string;
        image:string;
    };
    mainImage:{
        assert:{
            url:string;
            //_ref
        };
    };
    slug:{
        current:string;
    }
    body:object[]
}