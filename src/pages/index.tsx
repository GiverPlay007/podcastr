export default function Home(props) {
  console.log(props.episodes);

  return <>
  {
    JSON.stringify(props.episodes)
  }
  </>;
}

export async function getStaticProps() {
  const response = await fetch("http://localhost:3001/episodes");
  const data = await response.json();

  return {
    props: {
      episodes: data
    },
    revalidate: 36000
  };
}