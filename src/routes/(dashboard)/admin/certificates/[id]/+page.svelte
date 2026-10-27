<script lang="ts">
	import CertificateForm from '../_components/certificate-form.svelte';
	import type { PageProps } from './$types.js';

	let { data }: PageProps = $props();
</script>

<CertificateForm mode="edit" certificate={data.certificate} />
