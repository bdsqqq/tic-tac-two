export default function Page({ params }: { params: { datasetId: string } }) {
  return <div>dataset: {params.datasetId}</div>;
}
