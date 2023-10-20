export default function Page({ params }: { params: { datasetId: string } }) {
  return <div>Stream dataset: {params.datasetId}</div>;
}
