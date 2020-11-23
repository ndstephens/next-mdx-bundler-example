import {GetStaticPropsContext, NextPage, GetStaticPaths, InferGetStaticPropsType} from 'next'

import {getPostBySlug, getPosts} from '../lib/data/posts'

import {MDX} from '../lib/components/mdx'
import {Layout} from '../lib/components/layout'

import {prepareMDX} from '../lib/functions/prepare-mdx'

export const getStaticProps = async ({params}: GetStaticPropsContext) => {
  if(params?.slug && Array.isArray(params.slug)){
    const post = await getPostBySlug(params.slug, ['slug', 'title', 'content'])
    const source = await prepareMDX(post.content)

    return {
      props: {
        post,
        source
      }
    }
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await getPosts(['slug'], {limit: false})

  const paths = posts.map(({slug}) => {
    return {params: {slug}}
  })

  return {
    paths,
    fallback: false
  }
}

const MDXPage: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = ({post, source}) => {
  return <Layout>
    <h1>{post.title}</h1>
    <MDX source={source} />
  </Layout>
}

export default MDXPage